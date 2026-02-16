export const generateEmailTemplate = (otp, name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CountryEdu | Email Verification</title>
  <style>
    body {
      font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f7fa;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      animation: fadeIn 0.6s ease;
    }
    .header {
      background: linear-gradient(135deg, #0f766e, #134e4a);
      color: #fff;
      text-align: center;
      padding: 40px 20px;
    }
    .header h1 {
      font-size: 28px;
      margin: 0;
      letter-spacing: 1px;
    }
    .header p {
      font-size: 14px;
      margin-top: 8px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 12px;
      color: #111827;
      font-weight: 600;
    }
    .message {
      font-size: 15px;
      color: #444;
      line-height: 1.6;
      margin-bottom: 25px;
    }
    .otp-box {
      background: linear-gradient(135deg, #0ea5e9, #2563eb);
      color: #ffffff;
      font-size: 32px;
      font-weight: 700;
      text-align: center;
      border-radius: 12px;
      padding: 20px 0;
      letter-spacing: 10px;
      box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4);
      margin: 30px 0;
    }
    .info {
      background: #f1f5f9;
      border-radius: 10px;
      padding: 15px;
      color: #475569;
      font-size: 13px;
      line-height: 1.5;
    }
    .footer {
      background: #f8fafc;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      padding: 20px;
      border-top: 1px solid #e5e7eb;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 600px) {
      .content { padding: 25px 20px; }
      .otp-box { font-size: 26px; letter-spacing: 8px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CountryEdu</h1>
      <p>Mock Interview Application</p>
    </div>

    <div class="content">
      <p class="greeting">Dear ${name},</p>
      <p class="message">
        Thank you for registering with <strong>CountryEdu</strong>. To proceed with your account setup and access our mock interview platform, please verify your email address using the One-Time Password (OTP) provided below.
      </p>

      <div class="otp-box">${otp}</div>

      <p class="message">
        Please note that this OTP will remain valid for <strong>10 minutes</strong>. For security reasons, do not share this code with anyone.
      </p>

      <div class="info">
        If you did not initiate this signup request, you may safely disregard this email.  
        For assistance, please contact our support team at <a href="mailto:support@countryedu.com">support@countryedu.com</a>.
      </div>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} CountryEdu — All Rights Reserved.<br/>
      Empowering Careers Through Practice and Preparation
    </div>
  </div>
</body>
</html>
`;

export const generateForgotPasswordTemplate = (otp, name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CountryEdu | Password Reset</title>
  <style>
    body {
      font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f7fa;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      animation: fadeIn 0.6s ease;
    }
    .header {
      background: linear-gradient(135deg, #7c3aed, #4c1d95);
      color: #fff;
      text-align: center;
      padding: 40px 20px;
    }
    .header h1 {
      font-size: 28px;
      margin: 0;
      letter-spacing: 1px;
    }
    .header p {
      font-size: 14px;
      margin-top: 8px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 12px;
      color: #111827;
      font-weight: 600;
    }
    .message {
      font-size: 15px;
      color: #444;
      line-height: 1.6;
      margin-bottom: 25px;
    }
    .otp-box {
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: #ffffff;
      font-size: 32px;
      font-weight: 700;
      text-align: center;
      border-radius: 12px;
      padding: 20px 0;
      letter-spacing: 10px;
      box-shadow: 0 6px 18px rgba(234, 88, 12, 0.4);
      margin: 30px 0;
    }
    .info {
      background: #f1f5f9;
      border-radius: 10px;
      padding: 15px;
      color: #475569;
      font-size: 13px;
      line-height: 1.5;
    }
    .footer {
      background: #f8fafc;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      padding: 20px;
      border-top: 1px solid #e5e7eb;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 600px) {
      .content { padding: 25px 20px; }
      .otp-box { font-size: 26px; letter-spacing: 8px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CountryEdu</h1>
      <p>Password Reset Request</p>
    </div>

    <div class="content">
      <p class="greeting">Hello ${name},</p>

      <p class="message">
        We received a request to reset the password for your <strong>CountryEdu</strong> account.
        Please use the One-Time Password (OTP) below to proceed with resetting your password.
      </p>

      <div class="otp-box">${otp}</div>

      <p class="message">
        This OTP is valid for <strong>10 minutes</strong>. If you did not request a password reset,
        please ignore this email — your account remains secure.
      </p>

      <div class="info">
        For security reasons, never share this OTP with anyone.  
        Need help? Contact us at <a href="mailto:support@countryedu.com">support@countryedu.com</a>.
      </div>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} CountryEdu — All Rights Reserved.<br/>
      Empowering Careers Through Practice and Preparation
    </div>
  </div>
</body>
</html>
`;


export const generateContactUsTemplate = ({ name, email, message }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message | CountryEdu</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #eef2f7;
      font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #111827;
    }

    .wrapper {
      padding: 48px 16px;
    }

    .container {
      max-width: 680px;
      margin: auto;
      background: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 18px 55px rgba(0, 0, 0, 0.12);
    }

    .header {
      background: linear-gradient(135deg, #0f766e, #115e59);
      padding: 40px 24px;
      text-align: center;
      color: #ffffff;
    }

    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .header h1 {
      margin: 0;
      font-size: 30px;
      font-weight: 700;
    }

    .content {
      padding: 42px 36px;
    }

    .section {
      margin-bottom: 26px;
    }

    .label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 6px;
    }

    .value {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .email {
      color: #0f766e;
      text-decoration: none;
    }

    .message-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-left: 5px solid #0f766e;
      padding: 22px;
      border-radius: 14px;
      font-size: 15px;
      line-height: 1.7;
      color: #374151;
      white-space: pre-line;
    }

    .footer {
      background: #f9fafb;
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #9ca3af;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 600px) {
      .content {
        padding: 30px 22px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">

      <div class="header">
        <div class="badge">New Message</div>
        <h1>Contact Form Submission</h1>
      </div>

      <div class="content">

        <div class="section">
          <div class="label">Sender Name</div>
          <div class="value">${name}</div>
        </div>

        <div class="section">
          <div class="label">Sender Email</div>
          <div class="value">
            <a href="mailto:${email}" class="email">${email}</a>
          </div>
        </div>

        <div class="section">
          <div class="label">Message</div>
          <div class="message-box">
            ${message}
          </div>
        </div>

      </div>

      <div class="footer">
        © ${new Date().getFullYear()} CountryEdu · Admin Notification
      </div>

    </div>
  </div>
</body>
</html>
`;


export const generateContactAutoReplyTemplate = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thank You for Contacting CountryEdu</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1f2937;
    }

    .wrapper {
      padding: 40px 16px;
    }

    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    }

    .header {
      background: linear-gradient(135deg, #2563eb, #1e40af);
      padding: 36px 20px;
      text-align: center;
      color: #ffffff;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .content {
      padding: 38px 30px;
    }

    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .text {
      font-size: 15px;
      line-height: 1.7;
      color: #4b5563;
      margin-bottom: 22px;
    }

    .highlight {
      background: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 16px;
      border-radius: 10px;
      font-size: 14px;
      color: #1e3a8a;
      line-height: 1.6;
    }

    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #9ca3af;
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 600px) {
      .content {
        padding: 28px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">

      <div class="header">
        <h1>CountryEdu</h1>
      </div>

      <div class="content">
        <p class="greeting">Hello ${name},</p>

        <p class="text">
          Thank you for reaching out to <strong>CountryEdu</strong>!  
          We’ve successfully received your message and our support team will review it shortly.
        </p>

        <p class="text">
          We typically respond within <strong>24–48 hours</strong>. If your inquiry is urgent,
          please include additional details when replying to this email.
        </p>

        <div class="highlight">
          💡 <strong>What’s next?</strong><br/>
          Our team will carefully review your message and get back to you as soon as possible.
        </div>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} CountryEdu — All Rights Reserved<br/>
        Need help? Contact us at
        <a href="mailto:support@countryedu.com" style="color:#2563eb;text-decoration:none;">
          support@countryedu.com
        </a>
      </div>

    </div>
  </div>
</body>
</html>
`;
