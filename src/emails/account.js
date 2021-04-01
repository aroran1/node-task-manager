const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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';

sgMail.setApiKey(sendgridAPIKey);

const msg = {
  to: 'nidhigulati2001@gmail.com',
  from: 'nidhigulati2001@gmail.com',
  subject: 'Task Manager App: Send grid email creation',
  text: 'I hope this one actually gets to you.'
};

sgMail.send(msg)

// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   });