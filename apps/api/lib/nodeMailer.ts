import { GOOGLE_PASSWORD, GOOGLE_USER } from '../src/config';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GOOGLE_USER,
    pass: GOOGLE_PASSWORD,
  },
});

export const templateNodemailer = async (email: string, token: string) => {
  await transporter.sendMail({
    from: `"StayCation" <${GOOGLE_USER}>`,
    to: email,
    subject: 'Verify Email',
    html: `
      <p>Click the link below to verify your email:</p>
      <a href="http://localhost:3000/verification-email?token=${token}">Click here</a>
    `,
  });
};

export const templateRuleNodemailer = async (email: string) => {
  await transporter.sendMail({
    from: `"StayCation" <${GOOGLE_USER}>`,
    to: email,
    subject: 'House Rule',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rule of House - StayCation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #007BFF;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            font-size: 20px;
            color: #007BFF;
        }
        .content p {
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
    </head>
<body>    
    <div class="container">
        <div class="header">
            <h1>StayCation</h1>
        </div>
        <div class="content">
            <h2>Rule of House</h2>
            <p>Dear Guest,</p>
            <p>Welcome to StayCation! We are delighted to have you with us. Please take a moment to read through our house rules to ensure a pleasant stay for everyone:</p>
            <ul>
                <li><strong>Check-in/Check-out:</strong> Check-in time is 3:00 PM and check-out time is 11:00 AM.</li>
                <li><strong>Noise:</strong> Please keep noise to a minimum after 10:00 PM to respect other guests.</li>
                <li><strong>Smoking:</strong> Smoking is not allowed inside the premises. Designated smoking areas are provided outside.</li>
                <li><strong>Pets:</strong> Pets are not allowed unless prior arrangements have been made.</li>
                <li><strong>Cleanliness:</strong> Please keep the premises clean and dispose of trash in designated bins.</li>
                <li><strong>Damage:</strong> Any damage to the property must be reported immediately. Guests may be charged for repairs.</li>
            </ul>
            <p>If you have any questions or need assistance, feel free to contact our front desk. We hope you enjoy your stay!</p>
            <p>Best regards,</p>
            <p>StayCation Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 StayCation. All rights reserved.</p>
        </div>
    </div>
    </body>
</html>
    `,
  });
};
