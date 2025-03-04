import { NextResponse } from 'next/server';
import nodemailer, { TransportOptions } from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
} as TransportOptions);

export async function POST(request: Request) {
  const body = await request.json()
  // Cấu hình email
  const mailOptions = {
    from: '"Suburbia" <no-reply@demomailtrap.com>',
    to: 'tunm17421@gmail.com',
    subject: `${body.subject}`,
    text: `${body.text}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully', info }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
