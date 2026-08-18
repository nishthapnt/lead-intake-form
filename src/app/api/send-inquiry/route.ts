import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      company,
      phone,
      message,
      submittedAt,
    } = body;

    if (!name || !email || !company || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, email, company and message are required.',
        },
        { status: 400 }
      );
    }

    const subject = `New Website Inquiry — ${company}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <h2 style="margin-bottom: 24px;">
          New Website Inquiry
        </h2>

        <div style="background: #f7f7f7; padding: 20px; border-radius: 10px;">
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Company:</strong> ${escapeHtml(company)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
          <p>
            <strong>Submitted:</strong>
            ${escapeHtml(submittedAt || new Date().toISOString())}
          </p>
        </div>

        <h3 style="margin-top: 30px;">What they're trying to solve</h3>

        <div style="
          background: #f9fafb;
          border-left: 4px solid #111827;
          padding: 16px;
          white-space: pre-wrap;
        ">
          ${escapeHtml(message)}
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

        <p style="color: #6b7280; font-size: 13px;">
          This inquiry was submitted through the Northstar Digital website.
        </p>
      </div>
    `;

    const text = `
New Website Inquiry

Name: ${name}
Email: ${email}
Company: ${company}
Phone: ${phone || 'Not provided'}
Submitted: ${submittedAt || new Date().toISOString()}

What they're trying to solve:

${message}
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.INQUIRY_TO_EMAIL!,
      replyTo: email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Resend error:', error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send inquiry email.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });
  } catch (error) {
    console.error('Inquiry API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong while sending the inquiry.',
      },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}