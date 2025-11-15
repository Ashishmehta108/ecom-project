// lib/send-email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  from = "Acme <onboarding@resend.dev>",
}: SendEmailOptions) {
  try {
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    return {
      success: true,
      id: response?.data?.id,
    };
  } catch (error: any) {
    console.error("Resend Error:", error);
    return {
      success: false,
      error: error?.message || "Failed to send email",
    };
  }
}
