import nodemailer from "nodemailer";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, message } = await request.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS, // must be an App Password
    },
  });

  // 1️⃣ Email to YOU
  const adminMail = {
    from: `"Portfolio Website" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    replyTo: email, // user’s email
    subject: `Message from ${firstName} ${lastName}`,
    text: `Email: ${email}\n\n${message}`,
  };

  // 2️⃣ Auto-reply to USER
  const autoReply = {
    from: `"Feel Frame Studios" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "We got your message!",
    text: `Hi ${firstName},\n\nThanks for reaching out. We'll be with you soon.\n\nBest,\nFeel Frame Studios`,
  };

  try {
    await transporter.sendMail(adminMail);
    await transporter.sendMail(autoReply);

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500 }
    );
  }
}

/* 36cfca730320e93202fac852f5ca7b285212aeac78079228431a529cf9614ba48ddd87adbbe8b1ed27897def6f368652d4fc40261e8284352c9f98d0a66a73a0f1ff0caab759357cfe9d0e23e3e578fd430bae63e20f411fbeb82a187c5983a7c23b582698d97252bc28d02ef56b31a299fc9f1df7676f8276a0523c7fee1c2e
 */