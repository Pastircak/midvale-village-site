// Cloudflare Pages Function — POST /contact
// Validates Turnstile, sanitizes input, sends email via MailChannels.
// Required env vars (set in Cloudflare Pages -> Settings -> Environment variables):
//   - CONTACT_INBOX            (e.g. "ryan@pastircak.com")
//   - CONTACT_FROM             (e.g. "no-reply@midvaleohio.org")
//   - CONTACT_FROM_NAME        (e.g. "Village of Midvale Website")
//   - TURNSTILE_SECRET_KEY     (server-side Turnstile secret; optional during local dev)

interface Env {
  CONTACT_INBOX: string;
  CONTACT_FROM: string;
  CONTACT_FROM_NAME: string;
  TURNSTILE_SECRET_KEY?: string;
}

const TOPIC_LABELS: Record<string, string> = {
  general: 'General inquiry',
  report: 'Report an issue',
  records: 'Public records request',
  other: 'Other',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function verifyTurnstile(token: string, secret: string, remoteIp: string | null): Promise<boolean> {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteIp) body.set('remoteip', remoteIp);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!res.ok) return false;
  const data: { success?: boolean } = await res.json();
  return Boolean(data.success);
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const remoteIp = request.headers.get('CF-Connecting-IP');

  // Parse form (URL-encoded or multipart)
  const ct = request.headers.get('Content-Type') ?? '';
  let form: FormData;
  try {
    if (ct.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      form = new FormData();
      for (const [k, v] of new URLSearchParams(text)) form.append(k, v);
    } else {
      form = await request.formData();
    }
  } catch {
    return jsonResponse({ ok: false, error: 'Could not parse form data.' }, 400);
  }

  const get = (k: string): string => String(form.get(k) ?? '').trim();

  // Honeypot — bots fill this
  if (get('company')) return jsonResponse({ ok: true }); // silent accept

  const name = get('name').slice(0, 120);
  const email = get('email').slice(0, 200);
  const phone = get('phone').slice(0, 40);
  const topic = get('topic') || 'general';
  const message = get('message').slice(0, 2000);
  const turnstileToken = get('cf-turnstile-response');

  // Validate
  if (!name || !email || !message) {
    return jsonResponse({ ok: false, error: 'Please fill in name, email, and message.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ ok: false, error: 'That email address looks invalid.' }, 400);
  }

  // Verify Turnstile if configured
  if (env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return jsonResponse({ ok: false, error: 'Please complete the security check.' }, 400);
    }
    const ok = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, remoteIp);
    if (!ok) return jsonResponse({ ok: false, error: 'Security check failed. Please try again.' }, 400);
  }

  // Build email
  const subject = `[Village of Midvale] ${TOPIC_LABELS[topic] ?? topic} — ${name}`;
  const text = [
    `Topic: ${TOPIC_LABELS[topic] ?? topic}`,
    `Name:  ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : '',
    `IP:    ${remoteIp ?? 'unknown'}`,
    '',
    message,
  ].filter(Boolean).join('\n');
  const html = `
    <p><strong>Topic:</strong> ${escapeHtml(TOPIC_LABELS[topic] ?? topic)}</p>
    <p><strong>Name:</strong> ${escapeHtml(name)}<br>
       <strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a><br>
       ${phone ? `<strong>Phone:</strong> ${escapeHtml(phone)}<br>` : ''}
       <strong>IP:</strong> ${escapeHtml(remoteIp ?? 'unknown')}</p>
    <hr>
    <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
  `;

  const mcBody = {
    personalizations: [{ to: [{ email: env.CONTACT_INBOX }] }],
    from: { email: env.CONTACT_FROM, name: env.CONTACT_FROM_NAME },
    reply_to: { email, name },
    subject,
    content: [
      { type: 'text/plain', value: text },
      { type: 'text/html', value: html },
    ],
  };

  const mcRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mcBody),
  });

  if (!mcRes.ok) {
    const err = await mcRes.text();
    console.error('MailChannels error', mcRes.status, err);
    return jsonResponse({ ok: false, error: 'Could not send your message right now. Please try again later, or call the village office.' }, 502);
  }

  return jsonResponse({ ok: true });
};

// Hint anything else that hits this path
export const onRequest: PagesFunction = async ({ request, next }) => {
  if (request.method === 'POST') {
    // Defer to onRequestPost, which Cloudflare wires automatically.
    return next();
  }
  // Let Astro's static /contact page render for GET
  return next();
};
