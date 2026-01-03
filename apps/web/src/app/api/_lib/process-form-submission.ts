import { NextRequest } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

import type { FormField } from "@/app/_content/contact";

type FieldValue = string | string[];
type FieldMap = Record<string, FieldValue>;

export type FormSubmissionPayload = {
  submittedAt: string;
  fields: FieldMap;
  metadata: {
    userAgent: string | null;
    referrer: string | null;
  };
};

type MessageContext = {
  recipientName: string | null;
  summaryHtml: string;
  summaryText: string;
  displayName: string;
};

type MessageFactory = string | ((payload: FormSubmissionPayload, context: MessageContext) => string);

type AutoResponseOptions = {
  emailField: string;
  nameField?: string;
  subject: MessageFactory;
  html: MessageFactory;
  text: MessageFactory;
};

type FormSubmissionOptions = {
  formKey: string;
  displayName: string;
  notificationEmail?: string | null;
  successMessage: string;
  missingNotificationMessage: string;
  fieldDefinitions?: FormField[];
  subject: string | ((payload: FormSubmissionPayload) => string);
  replyToField?: string;
  autoResponse?: AutoResponseOptions;
};

type EmailContent = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

function getSesConfig()
{
  return {
    region: process.env.SES_REGION || "ap-northeast-1",
    fromEmail: process.env.SES_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL,
  };
}

let sesClient: SESClient | null = null;

function getSesClient(): SESClient
{
  const { region } = getSesConfig();

  if (!sesClient)
  {
    sesClient = new SESClient({ region });
  }

  return sesClient;
}

function escapeHtml(value: string)
{
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function coerceToString(value: FieldValue): string
{
  if (Array.isArray(value))
  {
    return value.join(", ");
  }

  return value;
}

function resolveMessage(
  template: MessageFactory,
  payload: FormSubmissionPayload,
  context: MessageContext,
)
{
  return typeof template === "function" ? template(payload, context) : template;
}

type FieldEntry = { key: string; label: string; value: string };

function buildFieldEntries(
  payload: FormSubmissionPayload,
  fieldDefinitions?: FormField[],
): FieldEntry[]
{
  const labelMap = new Map(fieldDefinitions?.map((field) => [field.key, field.label]));

  return Object.entries(payload.fields).map(([key, rawValue]) =>
  {
    const label = labelMap.get(key) ?? key;
    const value = coerceToString(rawValue);
    return { key, label, value };
  });
}

function buildSummaryHtml(entries: FieldEntry[])
{
  const rows = entries
    .map(
      ({ label, value }) =>
        `<tr><th style="text-align:left;padding:8px 12px;background:#f1f5f9;color:#0f172a;">${escapeHtml(
          label,
        )}</th><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${escapeHtml(
          value || "(未入力)",
        )}</td></tr>`,
    )
    .join("");

  return `
    <table style="border-collapse:collapse;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;margin-top:16px;">
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildSummaryText(entries: FieldEntry[])
{
  const lines: string[] = [];
  entries.forEach(({ label, value }) =>
  {
    lines.push(`${label}: ${value || "(未入力)"}`);
  });
  return lines.join("\n");
}

function buildEmailContent(
  payload: FormSubmissionPayload,
  options: FormSubmissionOptions,
): EmailContent
{
  const entries = buildFieldEntries(payload, options.fieldDefinitions);

  const subject =
    typeof options.subject === "function" ? options.subject(payload) : options.subject;

  const rowsHtml = entries
    .map(
      ({ label, value }) =>
        `<tr><th style="text-align:left;padding:6px 12px;background:#0f172a;color:#f8fafc;">${escapeHtml(label)}</th><td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;">${escapeHtml(
          value || "(未入力)",
        )}</td></tr>`,
    )
    .join("");

  const metadataRows = [
    { label: "送信時刻", value: payload.submittedAt },
    { label: "Referrer", value: payload.metadata.referrer ?? "(不明)" },
    { label: "User Agent", value: payload.metadata.userAgent ?? "(不明)" },
  ]
    .map(
      ({ label, value }) =>
        `<tr><th style="text-align:left;padding:6px 12px;background:#f1f5f9;color:#0f172a;">${escapeHtml(label)}</th><td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#f8fafc;padding:24px;">
      <h1 style="margin:0 0 16px;font-size:20px;color:#0f172a;">${escapeHtml(
    options.displayName,
  )} の新しい送信</h1>
      <table style="border-collapse:collapse;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 12px 24px -16px rgba(15,23,42,0.35);">
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <h2 style="margin:24px 0 12px;font-size:15px;color:#334155;">メタデータ</h2>
      <table style="border-collapse:collapse;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 12px 24px -16px rgba(15,23,42,0.25);">
        <tbody>
          ${metadataRows}
        </tbody>
      </table>
    </div>
  `;

  const textLines: string[] = [
    `${options.displayName} の新しい送信`,
    `送信時刻: ${payload.submittedAt}`,
    "",
  ];

  entries.forEach(({ label, value }) =>
  {
    textLines.push(`${label}: ${value || "(未入力)"}`);
  });

  textLines.push("", `Referrer: ${payload.metadata.referrer ?? "(不明)"}`);
  textLines.push(`User Agent: ${payload.metadata.userAgent ?? "(不明)"}`);

  const replyToField = options.replyToField;
  let replyTo: string | undefined;

  if (replyToField)
  {
    const candidate = payload.fields[replyToField];
    const candidateValue = candidate ? coerceToString(candidate) : "";
    if (candidateValue && candidateValue.includes("@"))
    {
      replyTo = candidateValue;
    }
  }

  return {
    subject,
    html,
    text: textLines.join("\n"),
    replyTo,
  };
}

async function sendSesEmail({
  to,
  from,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
})
{
  const client = getSesClient();

  const command = new SendEmailCommand({
    Source: from,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: text,
          Charset: "UTF-8",
        },
        Html: {
          Data: html,
          Charset: "UTF-8",
        },
      },
    },
    ReplyToAddresses: replyTo ? [replyTo] : [],
  });

  return client.send(command);
}

export async function processFormSubmission(
  request: NextRequest,
  options: FormSubmissionOptions,
)
{
  const { fromEmail } = getSesConfig();

  if (!fromEmail)
  {
    console.error("SES is not fully configured (missing SES_FROM_EMAIL)");
    return Response.json({
      message: "Email delivery is not configured.",
      debug: {
        region: process.env.SES_REGION,
        hasFromEmail: !!process.env.SES_FROM_EMAIL,
        fromEmailLen: process.env.SES_FROM_EMAIL?.length,
        hasToEmail: !!process.env.SES_TO_EMAIL,
        envKeys: Object.keys(process.env).filter(k => k.startsWith("SES") || k.startsWith("AWS"))
      }
    }, { status: 500 });
  }

  if (!options.notificationEmail)
  {
    console.error(`${options.formKey} notification email is not configured`);
    return Response.json({ message: options.missingNotificationMessage }, { status: 500 });
  }

  let body: unknown;

  try
  {
    body = await request.json();
  } catch (error)
  {
    console.error(`${options.formKey} payload parse error`, error);
    return Response.json({ message: "Invalid payload." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("fields" in body))
  {
    return Response.json({ message: "Invalid payload." }, { status: 400 });
  }

  const fieldsCandidate = (body as { fields?: unknown }).fields;

  if (!fieldsCandidate || typeof fieldsCandidate !== "object" || Array.isArray(fieldsCandidate))
  {
    return Response.json({ message: "Invalid payload." }, { status: 400 });
  }

  // Validate fields based on definitions
  if (options.fieldDefinitions)
  {
    for (const field of options.fieldDefinitions)
    {
      const value = (fieldsCandidate as FieldMap)[field.key];

      // Check required fields
      if (field.required)
      {
        if (value === undefined || value === null || value === "")
        {
          return Response.json({ message: `Missing required field: ${field.label}` }, { status: 400 });
        }
        if (Array.isArray(value) && value.length === 0)
        {
          return Response.json({ message: `Missing required field: ${field.label}` }, { status: 400 });
        }
      }

      // Check email format
      if (field.type === "email" && value && typeof value === "string")
      {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
        {
          return Response.json({ message: `Invalid email format: ${field.label}` }, { status: 400 });
        }
      }
    }
  }

  const payload: FormSubmissionPayload = {
    submittedAt: new Date().toISOString(),
    fields: fieldsCandidate as FieldMap,
    metadata: {
      userAgent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    },
  };

  const emailContent = buildEmailContent(payload, options);

  try
  {
    const output = await sendSesEmail({
      to: options.notificationEmail,
      from: fromEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      replyTo: emailContent.replyTo,
    });

    console.info(
      `[forms:${options.formKey}] email sent to ${options.notificationEmail}`,
      { messageId: output.MessageId },
    );

    const autoResponseConfig = options.autoResponse;

    if (autoResponseConfig)
    {
      const recipientRaw = payload.fields[autoResponseConfig.emailField];
      const recipientEmail = recipientRaw ? coerceToString(recipientRaw).trim() : "";

      if (recipientEmail.includes("@"))
      {
        const nameRaw = autoResponseConfig.nameField
          ? payload.fields[autoResponseConfig.nameField]
          : undefined;
        const recipientName = nameRaw ? coerceToString(nameRaw).trim() || null : null;
        const summaryEntries = buildFieldEntries(payload, options.fieldDefinitions);
        const summaryHtml = buildSummaryHtml(summaryEntries);
        const summaryText = buildSummaryText(summaryEntries);

        const context: MessageContext = {
          recipientName,
          summaryHtml,
          summaryText,
          displayName: options.displayName,
        };

        const autoSubject = resolveMessage(autoResponseConfig.subject, payload, context);
        const autoHtml = resolveMessage(autoResponseConfig.html, payload, context);
        const autoText = resolveMessage(autoResponseConfig.text, payload, context);

        const autoOutput = await sendSesEmail({
          to: recipientEmail,
          from: fromEmail,
          subject: autoSubject,
          html: autoHtml,
          text: autoText,
        });

        console.info(
          `[forms:${options.formKey}] auto-response sent to ${recipientEmail}`,
          { messageId: autoOutput.MessageId },
        );
      }
    }

    return Response.json({ message: options.successMessage });

  } catch (error)
  {
    console.error(`${options.formKey} email send failed`, error);

    // Enhanced logging for SES errors
    if (error && typeof error === "object" && "name" in error)
    {
      const err = error as { name: string; message: string };
      console.error(`SES Error Name: ${err.name}, Message: ${err.message}`);

      if (err.name === "MessageRejected")
      {
        return Response.json({ message: "Email delivery failed: Address not verified or spam detected.", error: err.message }, { status: 500 });
      }
      if (err.name === "AccountSendingPausedException")
      {
        return Response.json({ message: "Email delivery failed: Account sending paused.", error: err.message }, { status: 500 });
      }
      if (err.name === "AccessDeniedException")
      {
        return Response.json({ message: "Email delivery failed: Access denied. Check IAM permissions.", error: err.message }, { status: 500 });
      }
    }

    return Response.json({
      message: "Failed to send email.",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
