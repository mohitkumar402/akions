const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send internship application email
const sendApplicationEmail = async (applicationData) => {
  try {
    const transporter = createTransporter();

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email not configured. SMTP credentials missing.');
      return { success: false, message: 'Email not configured' };
    }

    const {
      fullName,
      email,
      phone,
      internshipTitle,
      company,
      coverLetter,
      experience,
      skills,
      education,
      availability,
      additionalInfo,
    } = applicationData;

    const mailOptions = {
      from: `"Ekions Platform" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `New Internship Application: ${internshipTitle} - ${fullName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000000; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #000; }
            .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #000; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Internship Application</h2>
            </div>
            <div class="content">
              <div class="section">
                <div class="label">Internship Position:</div>
                <div class="value">${internshipTitle} at ${company}</div>
              </div>
              
              <div class="section">
                <div class="label">Applicant Information:</div>
                <div class="value">
                  <strong>Name:</strong> ${fullName}<br>
                  <strong>Email:</strong> ${email}<br>
                  <strong>Phone:</strong> ${phone || 'Not provided'}
                </div>
              </div>

              ${education ? `
              <div class="section">
                <div class="label">Education:</div>
                <div class="value">${education}</div>
              </div>
              ` : ''}

              ${experience ? `
              <div class="section">
                <div class="label">Experience:</div>
                <div class="value">${experience}</div>
              </div>
              ` : ''}

              ${skills && skills.length > 0 ? `
              <div class="section">
                <div class="label">Skills:</div>
                <div class="value">${skills.join(', ')}</div>
              </div>
              ` : ''}

              ${availability ? `
              <div class="section">
                <div class="label">Availability:</div>
                <div class="value">${availability}</div>
              </div>
              ` : ''}

              ${coverLetter ? `
              <div class="section">
                <div class="label">Cover Letter:</div>
                <div class="value">${coverLetter.replace(/\n/g, '<br>')}</div>
              </div>
              ` : ''}

              ${additionalInfo ? `
              <div class="section">
                <div class="label">Additional Information:</div>
                <div class="value">${additionalInfo.replace(/\n/g, '<br>')}</div>
              </div>
              ` : ''}

              <div class="section">
                <div class="label">Application Date:</div>
                <div class="value">${new Date().toLocaleString()}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the Ekions Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Internship Application

Internship Position: ${internshipTitle} at ${company}

Applicant Information:
Name: ${fullName}
Email: ${email}
Phone: ${phone || 'Not provided'}

${education ? `Education: ${education}\n` : ''}
${experience ? `Experience: ${experience}\n` : ''}
${skills && skills.length > 0 ? `Skills: ${skills.join(', ')}\n` : ''}
${availability ? `Availability: ${availability}\n` : ''}
${coverLetter ? `Cover Letter:\n${coverLetter}\n` : ''}
${additionalInfo ? `Additional Information:\n${additionalInfo}\n` : ''}

Application Date: ${new Date().toLocaleString()}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Send product contact email
const sendProductContactEmail = async ({ to, productName, customerName, customerEmail, customerPhone, company, message, productId }) => {
  try {
    const transporter = createTransporter();
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email not configured. SMTP credentials missing.');
      return { success: false, message: 'Email not configured' };
    }

    const mailOptions = {
      from: `"Ekions" <${process.env.SMTP_USER}>`,
      to: to,
      subject: `New Product Contact Request: ${productName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 12px; background: white; border-radius: 6px; border-left: 4px solid #2563eb; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #1f2937; margin-top: 4px; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Product Contact Request</h2>
            </div>
            <div class="content">
              <p>You have received a new contact request for a product:</p>
              
              <div class="info-row">
                <div class="label">Product:</div>
                <div class="value">${productName}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Customer Name:</div>
                <div class="value">${customerName}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${customerEmail}">${customerEmail}</a></div>
              </div>
              
              <div class="info-row">
                <div class="label">Phone:</div>
                <div class="value"><a href="tel:${customerPhone}">${customerPhone}</a></div>
              </div>
              
              ${company ? `
              <div class="info-row">
                <div class="label">Company:</div>
                <div class="value">${company}</div>
              </div>
              ` : ''}
              
              ${message ? `
              <div class="info-row">
                <div class="label">Message:</div>
                <div class="value">${message}</div>
              </div>
              ` : ''}
              
              <div class="info-row">
                <div class="label">Product ID:</div>
                <div class="value">${productId}</div>
              </div>
              
              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                Please contact the customer as soon as possible to provide a quote and discuss their requirements.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Product contact email sent successfully');
  } catch (error) {
    console.error('Error sending product contact email:', error);
    throw error;
  }
};

// Send custom product request email
const sendCustomProductRequestEmail = async ({ to, customerName, customerEmail, customerPhone, company, productType, description, budget, timeline }) => {
  try {
    const transporter = createTransporter();
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email not configured. SMTP credentials missing.');
      return { success: false, message: 'Email not configured' };
    }

    const mailOptions = {
      from: `"Ekions" <${process.env.SMTP_USER}>`,
      to: to,
      subject: `New Custom Product Request from ${customerName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 12px; background: white; border-radius: 6px; border-left: 4px solid #2563eb; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #1f2937; margin-top: 4px; }
            .description-box { background: white; padding: 16px; border-radius: 6px; border-left: 4px solid #10b981; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Custom Product Request</h2>
            </div>
            <div class="content">
              <p>You have received a new custom product request:</p>
              
              <div class="info-row">
                <div class="label">Customer Name:</div>
                <div class="value">${customerName}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${customerEmail}">${customerEmail}</a></div>
              </div>
              
              <div class="info-row">
                <div class="label">Phone:</div>
                <div class="value"><a href="tel:${customerPhone}">${customerPhone}</a></div>
              </div>
              
              ${company && company !== 'Not provided' ? `
              <div class="info-row">
                <div class="label">Company:</div>
                <div class="value">${company}</div>
              </div>
              ` : ''}
              
              ${productType && productType !== 'Not specified' ? `
              <div class="info-row">
                <div class="label">Product Type:</div>
                <div class="value">${productType}</div>
              </div>
              ` : ''}
              
              <div class="info-row">
                <div class="label">Project Description:</div>
                <div class="description-box">${description.replace(/\n/g, '<br>')}</div>
              </div>
              
              ${budget && budget !== 'Not specified' ? `
              <div class="info-row">
                <div class="label">Budget Range:</div>
                <div class="value">${budget}</div>
              </div>
              ` : ''}
              
              ${timeline && timeline !== 'Not specified' ? `
              <div class="info-row">
                <div class="label">Timeline:</div>
                <div class="value">${timeline}</div>
              </div>
              ` : ''}
              
              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                Please contact the customer as soon as possible to discuss their custom product requirements.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Custom product request email sent successfully to', to);
  } catch (error) {
    console.error('Error sending custom product request email:', error);
    throw error;
  }
};

// Send contact form email
const sendContactFormEmail = async ({ name, email, subject, message }) => {
  try {
    const transporter = createTransporter();
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email not configured. SMTP credentials missing.');
      return { success: false, message: 'Email not configured' };
    }

    const mailOptions = {
      from: `"Akions Website" <${process.env.SMTP_USER}>`,
      to: 'akions@hotmail.com',
      replyTo: email,
      subject: subject || 'Contact Form Submission from Akions Website',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000000; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 12px; background: white; border-radius: 6px; border-left: 4px solid #2563eb; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #1f2937; margin-top: 4px; }
            .message-box { background: white; padding: 16px; border-radius: 6px; border-left: 4px solid #10b981; margin-top: 8px; white-space: pre-wrap; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <p>You have received a new message from the Akions website contact form:</p>
              
              <div class="info-row">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="info-row">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              ${subject ? `
              <div class="info-row">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
              </div>
              ` : ''}
              
              <div class="info-row">
                <div class="label">Message:</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="footer">
                <p>Please reply directly to: <a href="mailto:${email}">${email}</a></p>
                <p>This message was sent from the Akions website contact form.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${subject ? `Subject: ${subject}\n` : ''}

Message:
${message}

---
Please reply directly to: ${email}
This message was sent from the Akions website contact form.
      `.trim(),
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact form email sent successfully to akions@hotmail.com');
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw error;
  }
};

module.exports = {
  sendApplicationEmail,
  sendProductContactEmail,
  sendCustomProductRequestEmail,
  sendContactFormEmail,
};

