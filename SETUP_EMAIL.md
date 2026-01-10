# Email Setup Instructions

## Option 1: Use Resend (Recommended)

1. Go to [resend.com](https://resend.com) and create a free account
2. Verify your domain or use the default `onboarding@resend.dev`
3. Get your API key from the dashboard
4. Add it to your `.env.local` file:
   \`\`\`
   RESEND_API_KEY=re_your_api_key_here
   \`\`\`

## Option 2: No Setup Required

If you don't set up Resend, the form will still work and log all submissions to the server console. You can check the logs to see form submissions.

## Option 3: Alternative Email Services

You can replace the Resend integration with:

### Using Nodemailer (SMTP)
\`\`\`bash
npm install nodemailer @types/nodemailer
\`\`\`

### Using SendGrid
\`\`\`bash
npm install @sendgrid/mail
\`\`\`

### Using Mailgun
\`\`\`bash
npm install mailgun.js
\`\`\`

## Current Status

- ✅ Form validation works
- ✅ Form submissions are logged to console
- ✅ User gets success message
- ⚠️ Email sending requires API key setup
