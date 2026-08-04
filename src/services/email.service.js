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

module.exports = { 
    sendRegistrationEmail, 
    sendLoginAlertEmail 
};