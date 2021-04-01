const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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';

sgMail.setApiKey(sendgridAPIKey);

// const msg = {
//   to: 'nidhigulati2001@gmail.com',
//   from: 'nidhigulati2001@gmail.com',
//   subject: 'Task Manager App: Send grid email creation',
//   text: 'I hope this one actually gets to you.'
// };

// sgMail.send(msg)

// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   });

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'nidhigulati2001@gmail.com',
    subject: 'Thanks for joining Task Manager App!',
    text: `Welcome to the app ${name}! Please let us know how you are getting along using it.`
    // html: '<h1>Test HTML</h1>' - You can only show text or html
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'nidhigulati2001@gmail.com',
    subject: 'Sorry to see you leave Task Manager App!',
    text: `Goodbye ${name}, We are sad to know that you no longer wish to use the app! Please give us your valued feedback if we could have improved something to keep you onboarded with us. Hope to see you back soon`
    // html: '<h1>Test HTML</h1>' - You can only show text or html
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}