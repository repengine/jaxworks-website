const DEFAULT_TO_EMAIL = "jaxworks@yahoo.com";
const DEFAULT_SUBJECT = "JaxWorks LLC free estimate request";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

function getField(formData, name) {
  return String(formData.get(name) || "").trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function wantsJson(request) {
  return request.headers.get("accept")?.includes("application/json");
}

function makeResponse(request, status, payload) {
  if (wantsJson(request)) {
    return Response.json(payload, { status });
  }

  const heading = status >= 400 ? "Estimate request not sent" : "Estimate request sent";
  const message = payload.message || "Thanks. We received your request.";

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(heading)} | JaxWorks LLC</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: #f8faf9;
        color: #16212a;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        width: min(640px, 100%);
        padding: 32px;
        border: 1px solid #d9e2df;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0 18px 60px rgba(22, 33, 42, 0.14);
      }
      h1 { margin: 0 0 12px; line-height: 1.08; }
      p { color: #4d5b66; }
      a {
        display: inline-flex;
        align-items: center;
        min-height: 48px;
        margin-top: 16px;
        padding: 0 20px;
        border-radius: 8px;
        background: #f0b84c;
        color: #23180a;
        font-weight: 800;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>${escapeHtml(heading)}</h1>
      <p>${escapeHtml(message)}</p>
      <a href="/#quote">Back to JaxWorks</a>
    </main>
  </body>
</html>`,
    {
      status,
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
}

function buildEmail({ name, phone, email, propertyType, services, notes }) {
  const serviceText = services.length ? services.join(", ") : "Not specified";
  const rows = [
    ["Name", name],
    ["Phone", phone],
    ["Email", email],
    ["Property type", propertyType],
    ["Services", serviceText],
    ["Notes", notes || "None provided"],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlRows = rows
    .map(
      ([label, value]) => `<tr>
  <th align="left" style="padding:8px 12px;border-bottom:1px solid #d9e2df;background:#f8faf9;">${escapeHtml(label)}</th>
  <td style="padding:8px 12px;border-bottom:1px solid #d9e2df;">${escapeHtml(value)}</td>
</tr>`,
    )
    .join("");

  const html = `<h2 style="font-family:Arial,sans-serif;">JaxWorks LLC free estimate request</h2>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px;border:1px solid #d9e2df;">
${htmlRows}
</table>`;

  return { text, html };
}

async function handlePost({ request, env }) {
  let formData;

  try {
    formData = await request.formData();
  } catch {
    return makeResponse(request, 400, {
      ok: false,
      message: "We could not read the estimate request. Please call 904-891-1355.",
    });
  }

  if (getField(formData, "company")) {
    return makeResponse(request, 200, {
      ok: true,
      message: "Thanks. We received your request and will be in touch within 24 hours.",
    });
  }

  const name = getField(formData, "name");
  const phone = getField(formData, "phone");
  const email = getField(formData, "email");
  const propertyType = getField(formData, "propertyType");
  const notes = getField(formData, "notes");
  const services = formData.getAll("services").map((value) => String(value).trim()).filter(Boolean);

  if (!name || !phone || !email || !propertyType) {
    return makeResponse(request, 400, {
      ok: false,
      message: "Please fill out your name, phone, email, and property type.",
    });
  }

  if (!isValidEmail(email)) {
    return makeResponse(request, 400, {
      ok: false,
      message: "Please enter a valid email address.",
    });
  }

  if (!env.RESEND_API_KEY || !env.ESTIMATE_FROM_EMAIL) {
    return makeResponse(request, 500, {
      ok: false,
      message: "The estimate form is not configured yet. Please call 904-891-1355.",
    });
  }

  const { text, html } = buildEmail({ name, phone, email, propertyType, services, notes });
  const to = env.ESTIMATE_TO_EMAIL || DEFAULT_TO_EMAIL;
  const subject = env.ESTIMATE_EMAIL_SUBJECT || DEFAULT_SUBJECT;

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.ESTIMATE_FROM_EMAIL,
      to: [to],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    return makeResponse(request, 502, {
      ok: false,
      message: "The estimate request could not be sent. Please call 904-891-1355.",
    });
  }

  return makeResponse(request, 200, {
    ok: true,
    message: "Thanks. We received your request and will be in touch within 24 hours.",
  });
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "POST" },
    });
  }

  return handlePost(context);
}
