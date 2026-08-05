require('dotenv').config();
const nodemailer = require('nodemailer');


console.log("My Email User is:", process.env.EMAIL_USER);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-Team" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userMail, name) {
  // Use your actual app name here or pull it from process.env
  const appName = 'Backend-Leader Bank'; 
  
  // 1. More engaging subject line
  const subject = `Welcome to ${appName}, ${name}! 🎉`;

  // 2. Expanded plain text fallback (for clients that block HTML)
  const text = `Hello ${name},\n\nWelcome to ${appName}! Your account has been successfully created and is ready to use.\n\nLog in here: http://localhost:3000/login\n\nBest Regards,\nThe ${appName} Team`;

  // 3. Professional HTML template with inline styling
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 10px; background-color: #ffffff;">
        
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f6f8fa;">
            <h2 style="color: #0366d6; margin: 0;">${appName}</h2>
        </div>

        <div style="padding: 20px 0; color: #24292e;">
            <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.5;">Welcome to <strong>${appName}</strong>! Your account has been successfully created. We are thrilled to have you on board and look forward to serving your banking needs.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/login" style="background-color: #28a745; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Log In to Your Account</a>
            </div>

            <p style="font-size: 14px; color: #586069; margin-top: 30px;">
                For security reasons, never share your password with anyone. If you have any questions, simply reply to this email.
            </p>
        </div>

        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e1e4e8; color: #6a737d; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
        </div>
        
    </div>
  `;

  await sendEmail(userMail, subject, text, html);
}

async function sendLoginAlertEmail(userMail, name, ipAddress = 'Unknown IP', location = 'Raipur, India', device = 'Web Browser') {
  const appName = 'Backend-Leader Bank';
  
  // Formats the exact time of the login 
  const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const subject = `Security Alert: New Login to ${appName}`;

  // Plain text version
  const text = `Hello ${name},\n\nA successful login was just detected on your ${appName} account.\n\nDetails:\n- Time: ${loginTime}\n- Device: ${device}\n- Location: ${location}\n- IP Address: ${ipAddress}\n\nIf this was you, you can safely ignore this email. If you did not authorize this login, please reset your password immediately.\n\nBest Regards,\nThe ${appName} Team`;

  // Professional HTML template
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 10px; background-color: #ffffff;">
        
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f6f8fa;">
            <h2 style="color: #d73a49; margin: 0;">⚠️ Security Alert</h2>
            <p style="color: #586069; margin-top: 5px; font-size: 14px;">New login detected on your account</p>
        </div>

        <div style="padding: 20px 0; color: #24292e;">
            <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.5;">We noticed a new login to your <strong>${appName}</strong> account. If this was you, there is nothing you need to do. If not, please secure your account immediately.</p>
            
            <div style="background-color: #f6f8fa; border-radius: 8px; padding: 15px; margin: 25px 0;">
                <h3 style="margin-top: 0; color: #24292e; font-size: 16px; border-bottom: 1px solid #e1e4e8; padding-bottom: 10px;">Login Details</h3>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; color: #586069; line-height: 1.8;">
                    <li><strong>Time:</strong> ${loginTime}</li>
                    <li><strong>Device:</strong> ${device}</li>
                    <li><strong>Location:</strong> ${location}</li>
                    <li><strong>IP Address:</strong> ${ipAddress}</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/reset-password" style="background-color: #d73a49; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
            </div>

            <p style="font-size: 14px; color: #586069; margin-top: 30px; border-top: 1px solid #e1e4e8; padding-top: 20px;">
                If you need immediate assistance, please reply to this email or contact our fraud department.
            </p>
        </div>

        <div style="text-align: center; color: #6a737d; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
        </div>
        
    </div>
  `;

  await sendEmail(userMail, subject, text, html);
}

async function sendTransactionAlertEmail(userMail, name, transactionDetails) {
  const appName = 'Backend-Leader Bank';
  
  // 1. Safety Checklist & Default fallbacks
  const type = transactionDetails.type || 'Transaction';
  const amount = Number(transactionDetails.amount).toLocaleString('en-IN');
  
  // 2. Use the actual transaction time, fallback to now if missing
  const txDate = transactionDetails.timestamp ? new Date(transactionDetails.timestamp) : new Date();
  const transactionTime = txDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // 3. Mask account numbers for security compliance (e.g., "12345678" -> "XXXX5678")
  const maskAccount = (acc) => acc && acc.length > 4 ? `XXXX${acc.slice(-4)}` : 'N/A';
  const fromAccMasked = maskAccount(transactionDetails.fromAccount);
  const toAccMasked = maskAccount(transactionDetails.toAccount);

  const subject = `🔴 Alert: ${type} of ₹${amount} - ${appName}`;

  // Plain text version
  const text = `Hello ${name},\n\nA ${type} transaction has been made on your ${appName} account.\n\nDetails:\n- Time: ${transactionTime}\n- Amount: ₹${amount}\n- From Account: ${fromAccMasked}\n- To Account: ${toAccMasked}\n\nIf you did not authorize this transaction, please change your pin and contact our support immediately.\n\nBest Regards,\nThe ${appName} Team`;

  // Professional HTML template with responsive design and security focus
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f8; -webkit-text-size-adjust: 100%;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f8; padding: 20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e1e4e8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0" border="0">
              
              <!-- Header / Brand Banner -->
              <tr>
                <td style="background-color: #0366d6; padding: 30px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">
                    ${appName}
                  </h1>
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 30px 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #24292e;">
                  <p style="font-size: 16px; margin-top: 0; color: #24292e;">Dear <strong>${name}</strong>,</p>
                  <p style="font-size: 15px; line-height: 1.6; color: #444d56; margin-bottom: 25px;">
                    This is an automated security alert to inform you that a <strong>${type.toUpperCase()}</strong> transaction has been processed on your account.
                  </p>
                  
                  <!-- Info Grid Block -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f6f8fa; border-radius: 8px; border: 1px solid #e1e4e8; margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h3 style="margin: 0 0 15px 0; color: #24292e; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e1e4e8; padding-bottom: 8px;">
                          Transaction Summary
                        </h3>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px; line-height: 2;">
                          <tr>
                            <td width="35%" style="color: #586069; font-weight: 500;">Amount:</td>
                            <td style="color: #d73a49; font-weight: bold; font-size: 16px;">₹${amount}</td>
                          </tr>
                          <tr>
                            <td style="color: #586069;">Type:</td>
                            <td style="color: #24292e; text-transform: capitalize;">${type}</td>
                          </tr>
                          <tr>
                            <td style="color: #586069;">Date & Time:</td>
                            <td style="color: #24292e;">${transactionTime}</td>
                          </tr>
                          <tr>
                            <td style="color: #586069;">From Account:</td>
                            <td style="color: #24292e; font-family: monospace;">${fromAccMasked}</td>
                          </tr>
                          <tr>
                            <td style="color: #586069;">To Account:</td>
                            <td style="color: #24292e; font-family: monospace;">${toAccMasked}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Urgent Action / Warning Notice -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fff5f5; border-left: 4px solid #d73a49; border-radius: 4px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 12px 15px; font-size: 13px; color: #86181d; line-height: 1.5;">
                        <strong>Important Security Notice:</strong> If you did not make or authorize this transaction, please block your account or contact our emergency fraud support hotline immediately. Do not share your OTP or PIN with anyone.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #fafbfc; padding: 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #6a737d; border-top: 1px solid #e1e4e8;">
                  <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
                  <p style="margin: 0;">This is a system-generated alert. Please do not reply directly to this email.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // 4. Try/Catch block prevents crashing your main code if email service drops
  try {
    await sendEmail(userMail, subject, text, html);
    return { success: true };
  } catch (error) {
    console.error(`🚨 Failed to send transaction email to ${userMail}:`, error.message);
    // You can also log to external monitoring tools here (like Sentry)
    return { success: false, error: error.message };
  }
}

async function sendTransactionFailedEmail(userMail, name, transactionDetails) {
  const appName = 'Backend-Leader Bank';
  
  // 1. Safety Checklist & Default fallbacks
  const type = transactionDetails.type || 'Transaction';
  const amount = Number(transactionDetails.amount).toLocaleString('en-IN');
  const failureReason = transactionDetails.reason || 'Insufficient funds or technical network issue.';
  
  // 2. Use the actual transaction time, fallback to now if missing
  const txDate = transactionDetails.timestamp ? new Date(transactionDetails.timestamp) : new Date();
  const transactionTime = txDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // 3. Mask account numbers for security compliance
  const maskAccount = (acc) => acc && acc.length > 4 ? `XXXX${acc.slice(-4)}` : 'N/A';
  const fromAccMasked = maskAccount(transactionDetails.fromAccount);
  const toAccMasked = maskAccount(transactionDetails.toAccount);

  const subject = `⚠️ Failed: ${type} of ₹${amount} - ${appName}`;

  // Plain text version
  const text = `Hello ${name},\n\nWe wish to inform you that a ${type} transaction of ₹${amount} on your ${appName} account has FAILED.\n\nReason for Failure: ${failureReason}\n\nDetails:\n- Time: ${transactionTime}\n- From Account: ${fromAccMasked}\n- To Account: ${toAccMasked}\n\nIf money was debited from your account, it will be automatically reversed within 2-3 business days.\n\nBest Regards,\nThe ${appName} Team`;

  // Professional HTML template with Failed Status styles
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f8; -webkit-text-size-adjust: 100%;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f8; padding: 20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e1e4e8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0" border="0">
              
              <!-- Header / Warning Banner -->
              <tr>
                <td style="background-color: #d73a49; padding: 30px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">
                    Transaction Failed
                  </h1>
                </td>
              </tr>

              <!-- Main Content Body -->
              <tr>
                <td style="padding: 30px 25px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #24292e;">
                  <p style="font-size: 16px; margin-top: 0; color: #24292e;">Dear <strong>${name}</strong>,</p>
                  <p style="font-size: 15px; line-height: 1.6; color: #444d56; margin-bottom: 25px;">
                    We are writing to let you know that a recent <strong>${type.toUpperCase()}</strong> request could not be processed successfully. No money was transferred.
                  </p>
                  
                  <!-- Failure Reason Alert Box -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fff5f5; border-left: 4px solid #d73a49; border-radius: 4px; margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 15px; font-size: 14px; color: #86181d; line-height: 1.5;">
                        <strong>Reason for Failure:</strong> ${failureReason}
                      </td>
                    </tr>
                  </table>

                  <!-- Info Grid Block -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f6f8fa; border-radius: 8px; border: 1px solid #e1e4e8; margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 20px;">
                        <h3 style="margin: 0 0 15px 0; color: #24292e; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e1e4e8; padding-bottom: 8px;">
                          Attempted Transaction Details
                        </h3>
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px; line-height: 2;">
                          <tr>
                            <td width="35%" style="color: #586069; font-weight: 500;">Amount:</td>
                            <td style="color: #24292e; font-weight: bold; font-size: 16px;">₹${amount}</td>
                          </tr>
                          <tr>
                            <td style="color: #586069;">Status:</td>
                            <td style="color: #d73a49; font-weight: bold; text-transform: uppercase; font-size: 12px; background-color: #ffeef0; padding: 2px 8px; border-radius: 12px; display: inline-block; line-height: 1;">FAILED</td>
                          </tr>
                          <tr>
                            <td style="color: #586069;">Date & Time:</td>
                            <td style="color: #24292e;">${transactionTime}</td>
                          </tr>
                          <tr>
                            <td style="color: #586069;">From Account:</td>
                            <td style="color: #24292e; font-family: monospace;">${fromAccMasked}</td>
                          </tr>
                          <tr>
                            <td style="color: #586069;">To Account:</td>
                            <td style="color: #24292e; font-family: monospace;">${toAccMasked}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Refund/Reversal Policy Notice -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fffdf5; border-left: 4px solid #d4b216; border-radius: 4px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 12px 15px; font-size: 13px; color: #735c0f; line-height: 1.5;">
                        <strong>Note on Auto-Reversals:</strong> If your account was debited due to a network glitch during this failure, the funds are completely safe. They will be auto-credited back to your account within 48 to 72 business hours.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #fafbfc; padding: 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #6a737d; border-top: 1px solid #e1e4e8;">
                  <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
                  <p style="margin: 0;">This is a system-generated alert. Please do not reply directly to this email.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await sendEmail(userMail, subject, text, html);
    return { success: true };
  } catch (error) {
    console.error(`🚨 Failed to send transaction failure email to ${userMail}:`, error.message);
    return { success: false, error: error.message };
  }
}


module.exports = { 
    sendRegistrationEmail, 
    sendLoginAlertEmail,
    sendTransactionAlertEmail,
    sendTransactionFailedEmail
};
