'use server'

import { Resend } from 'resend'

export interface ContactInput {
  name: string
  email: string
  message: string
}

export interface ContactResult {
  ok: boolean
  error?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sanitize(s: string): string {
  return s.replace(/[<>]/g, '').trim()
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const name = sanitize(input.name ?? '').slice(0, 120)
  const email = sanitize(input.email ?? '').slice(0, 200)
  const message = sanitize(input.message ?? '').slice(0, 5000)

  if (!name || !email || !message) {
    return { ok: false, error: 'Please fill in all fields.' }
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }
  if (message.length < 10) {
    return { ok: false, error: 'Please write a longer message (at least 10 characters).' }
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  const to = process.env.CONTACT_TO_EMAIL

  if (!apiKey || !from || !to) {
    console.warn('[contact] RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL not set — skipping send')
    return {
      ok: false,
      error: 'Contact form is not configured yet. Please email us directly.',
    }
  }

  const resend = new Resend(apiKey)
  const subject = `[PetBale Contact] ${name}`
  const text = `New contact form submission from PetBale\n\nFrom: ${name} <${email}>\n\nMessage:\n${message}`
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#FAF6F0;color:#000;">
      <h2 style="margin:0 0 16px;font-size:20px;font-weight:900;text-transform:uppercase;">New Contact Message</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr><td style="padding:8px 0;font-weight:700;width:120px;">Name:</td><td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;">Email:</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      </table>
      <div style="background:#fff;border:1px solid #000;border-radius:8px;padding:16px;white-space:pre-wrap;line-height:1.5;">${escapeHtml(message)}</div>
      <p style="margin-top:24px;font-size:12px;color:#666;">Reply directly to this email to respond to the customer.</p>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
      replyTo: email,
    })
    if (result.error) {
      console.error('[contact] resend error', result.error)
      return { ok: false, error: 'Failed to send. Please try again.' }
    }
    return { ok: true }
  } catch (err) {
    console.error('[contact] unexpected error', err)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}
