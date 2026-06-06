import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key_123");

export const sendEmail = async ({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) => {
  // In development without an API key, just log the email
  if (!process.env.RESEND_API_KEY) {
    console.log("📨 [MOCK EMAIL] To:", to);
    console.log("📨 [MOCK EMAIL] Subject:", subject);
    return { success: true, id: "mock_id" };
  }

  try {
    const data = await resend.emails.send({
      from: "ARAH <hello@arah.my>", // Must be verified domain in Resend
      to,
      subject,
      react,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
};
