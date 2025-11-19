# Environment Variables Setup

## Required Environment Variables

Add these to your `.env` file in the `backend` directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://akionsdevteam:Mohit%40%24123@ekions.edczomg.mongodb.net/akions?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=17ad3bd882f17e506be2e7c39c2aeeba2e6c6f8c3cadabfa1869c660074a4e7b292df0157bc28eb06617451065c2a65ce97c1781a3ebaf8f5fdbdfda8b2387d7

# Razorpay
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=test_secret_1234567890

# Email Configuration (SMTP)
# For Gmail, you'll need to use an App Password: https://support.google.com/accounts/answer/185833
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Email (where internship applications will be sent)
ADMIN_EMAIL=admin@akions.com
```

## Setting Up Gmail SMTP

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Use the generated app password as `SMTP_PASS`

## Alternative Email Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

## Testing Email Configuration

After setting up your email, test it by submitting an internship application. Check your `ADMIN_EMAIL` inbox for the application notification.
