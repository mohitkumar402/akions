# Internship Application & Email Setup

## ✅ What's Been Implemented

### 1. **Sample Blog Posts with Interesting Facts**
- Created 5 engaging blog posts covering:
  - AI and Technology
  - Quantum Computing
  - Space Facts
  - Color Psychology
  - Human Brain Facts
- All blogs are published and visible on the Blog page

### 2. **Internship Application Form**
- Full-featured application form with fields:
  - Full Name (required)
  - Email (required)
  - Phone Number
  - Education
  - Experience
  - Skills (comma-separated)
  - Availability
  - Cover Letter
  - Additional Information
- Form validation and error handling
- Success/error alerts

### 3. **Email Notification System**
- Automatic email sent to admin when application is submitted
- Professional HTML email template
- Includes all application details
- Configurable via environment variables

### 4. **Sample Internships**
- 5 sample internships created:
  - Full Stack Developer Intern
  - AI/ML Research Intern
  - UI/UX Design Intern
  - DevOps Engineering Intern
  - Mobile App Development Intern

## 📧 Email Configuration

To enable email notifications, add these to your `backend/.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Email (where applications will be sent)
ADMIN_EMAIL=admin@akions.com
```

### Setting Up Gmail SMTP:

1. Go to your Google Account: https://myaccount.google.com/
2. Enable **2-Step Verification**
3. Generate an **App Password**: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Akions Backend" as the name
   - Copy the generated 16-character password
4. Use this password as `SMTP_PASS` in your `.env` file

### Alternative Email Providers:

See `backend/ENV_SETUP.md` for configuration details for:
- Outlook/Hotmail
- SendGrid
- Mailgun
- Other SMTP providers

## 🚀 How to Use

### 1. View Sample Blogs
- Navigate to the **Blog** page
- You'll see 5 interesting blog posts with fascinating facts

### 2. Apply for Internships
- Navigate to the **Internships** page
- Click "Apply Now" on any internship
- Fill out the application form
- Submit the application
- An email will be sent to the admin email address

### 3. Seed More Data (Optional)

To add more sample blogs:
```bash
cd akions-app/backend
npm run seed:blogs
```

To add more sample internships:
```bash
cd akions-app/backend
npm run seed:internships
```

## 📝 Application Flow

1. User clicks "Apply Now" on an internship
2. User is redirected to the application form
3. User fills out the form (Name and Email are required)
4. On submission:
   - Application is saved to database
   - Email is sent to admin email
   - User sees success message
   - User is redirected back to internships page

## 🔍 Database Schema

### InternshipApplication Model
- `internshipId` - Reference to internship
- `userId` - Reference to user
- `fullName` - Applicant's full name
- `email` - Applicant's email
- `phone` - Phone number
- `coverLetter` - Cover letter text
- `experience` - Experience description
- `skills` - Array of skills
- `education` - Education details
- `availability` - Availability information
- `additionalInfo` - Additional notes
- `status` - Application status (pending, reviewed, accepted, rejected)
- `appliedAt` - Timestamp

## 🛠️ Troubleshooting

### Email Not Sending?
1. Check that SMTP credentials are correct in `.env`
2. For Gmail, ensure you're using an App Password (not your regular password)
3. Check backend console for error messages
4. Verify `ADMIN_EMAIL` is set correctly

### Form Not Submitting?
1. Ensure you're logged in
2. Check that Name and Email fields are filled
3. Check browser console for errors
4. Verify backend server is running

## 📚 Files Created/Modified

### Backend:
- `backend/services/emailService.js` - Email sending service
- `backend/models/InternshipApplication.js` - Updated with form fields
- `backend/userService.js` - Updated to handle form data
- `backend/server.js` - Updated to send emails on application
- `backend/scripts/seedBlogs.js` - Script to seed sample blogs
- `backend/scripts/seedInternships.js` - Script to seed sample internships
- `backend/package.json` - Added nodemailer dependency

### Frontend:
- `frontend/src/screens/InternshipApplicationScreen.tsx` - Application form screen
- `frontend/src/screens/InternshipsScreen.tsx` - Updated to navigate to form
- `frontend/src/navigation/AppNavigator.tsx` - Added application screen route

## ✨ Next Steps

1. **Configure Email**: Set up your SMTP credentials in `.env`
2. **Test Application**: Submit a test internship application
3. **Check Email**: Verify you receive the application email
4. **Customize**: Modify email template in `backend/services/emailService.js` if needed

Everything is ready to go! 🎉

