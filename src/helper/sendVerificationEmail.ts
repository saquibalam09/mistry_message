import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const res = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    // console.log("log from sendverification->", res);

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (emailError) {
    console.log("Error sending verification email", emailError);
    return { success: false, message: "failed to  verfication error" };
  }
}
