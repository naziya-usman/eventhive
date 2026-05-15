const ticketConfirmationHTML = (name, eventTitle, eventDate, eventLocation, ticketId, qrCodeBase64) => {
  return `
    <div style="background-color: #f4f4f4; padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border-collapse: collapse;">
        <!-- Header -->
        <tr>
          <td align="center" style="padding: 40px 0; background-color: #2563eb;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Your Ticket is Ready!</h1>
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 24px; color: #333333; margin: 0 0 20px 0;">Hi ${name},</p>
            <p style="font-size: 16px; line-height: 24px; color: #333333; margin: 0 0 30px 0;">Pack your bags! You're officially registered for <strong>${eventTitle}</strong>. Here are your event details and your digital ticket.</p>
            
            <!-- Ticket Info Table -->
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 4px;">
              <tr>
                <td style="padding: 20px;">
                  <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom: 10px;">
                        <span style="font-size: 12px; color: #64748b; text-transform: uppercase;">Event</span><br>
                        <span style="font-size: 18px; color: #1e293b; font-weight: bold;">${eventTitle}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 10px;">
                        <span style="font-size: 12px; color: #64748b; text-transform: uppercase;">Date & Time</span><br>
                        <span style="font-size: 16px; color: #1e293b;">${eventDate}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 10px;">
                        <span style="font-size: 12px; color: #64748b; text-transform: uppercase;">Location</span><br>
                        <span style="font-size: 16px; color: #1e293b;">${eventLocation}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span style="font-size: 12px; color: #64748b; text-transform: uppercase;">Ticket ID</span><br>
                        <span style="font-size: 14px; color: #1e293b; font-family: monospace;">${ticketId}</span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td width="170" align="center" style="padding: 20px; border-left: 1px dashed #cbd5e1;">
                  <img src="data:image/png;base64,${qrCodeBase64}" style="width: 150px; height: 150px; display: block;" alt="Your ticket QR code" />
                  <p style="font-size: 10px; color: #94a3b8; margin: 10px 0 0 0;">Scan at entry</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td align="center" style="padding: 30px; background-color: #f1f5f9; color: #64748b; font-size: 12px;">
            <p style="margin: 0 0 10px 0;">Don't forget to have this QR code ready on your phone when you arrive.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} EventHive. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
};

module.exports = {
  ticketConfirmationHTML
};
