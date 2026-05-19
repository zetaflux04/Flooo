import nodemailer from "nodemailer";

export function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
  });
}

export async function sendContactEmail(data: {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  pincode?: string;
  message: string;
}) {
  const transporter = getTransporter();
  const to = process.env.NODEMAILER_EMAIL;
  if (!to || !process.env.NODEMAILER_PASS) {
    console.log("[DEV] Contact email skipped:", data);
    return;
  }

  await transporter.sendMail({
    from: `"Flooo Website" <${to}>`,
    to,
    subject: `New Enquiry from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email || "N/A"}</p>
      <p><strong>City:</strong> ${data.city || "N/A"}</p>
      <p><strong>Pincode:</strong> ${data.pincode || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  });
}
