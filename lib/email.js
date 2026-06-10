import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendBookingNotification(booking) {
  if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) return

  const callTypeLabel = booking.call_type === 'zoom' ? 'Zoom Meeting' : 'Phone Call'
  const adminEmail = process.env.GMAIL_EMAIL

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: linear-gradient(135deg, #673DE0, #8B5CF6); padding: 24px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Booking Confirmed</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">A client has scheduled a consultation call</p>
      </div>

      <div style="background: #fff; border: 1px solid #e5e7eb; padding: 24px; border-radius: 0 0 16px 16px;">
        <h2 style="color: #111; font-size: 18px; margin: 0 0 16px;">Booking Details</h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Client Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111; font-size: 14px; font-weight: 600;">${booking.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #673DE0; font-size: 14px;"><a href="mailto:${booking.email}">${booking.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Call Type</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111; font-size: 14px;">${callTypeLabel}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Package</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111; font-size: 14px;">${booking.package_name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">Date</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111; font-size: 14px;">${booking.date}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Time</td>
            <td style="padding: 10px 0; color: #111; font-size: 14px;">${booking.time} EAT</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 12px;">
          <p style="margin: 0; font-size: 13px; color: #6b7280;">
            View all bookings in your <a href="https://cyzora.vercel.app/admin" style="color: #673DE0; font-weight: 600;">admin dashboard</a>.
          </p>
        </div>
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"Cyzora Bookings" <${process.env.GMAIL_EMAIL}>`,
      to: adminEmail,
      subject: `New Booking: ${booking.name} — ${booking.package_name} (${callTypeLabel})`,
      html,
    })
  } catch (err) {
    console.error('Email notification failed:', err.message)
  }
}
