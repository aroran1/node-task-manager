# Sending Emails
To send emails from our applicatio we will be using email service providers "SendGrid".
https://app.sendgrid.com/guide/integrate/langs/nodejs/verify

- Create an account
- Create email account
  - verify account
- Dashboad > Web API or SMTP Relay > Web API > Node.js
- Create an API key : Task Manager App
- Get key and add kit in the `src/emails/account.js`
- Send the email

src/emails/account.js
```
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
javascript
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
```
- run command `node src/emails/account.js` before verifying from send grid