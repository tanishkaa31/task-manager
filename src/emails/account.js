//send emails related to user account
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'tgaur@iitg.ac.in',
        subject: 'Thanks for joining in!',
        text: `Hello ${name}, Welcome to the task manager application! Let us know how you're getting along!` //js template notation, makes it easier to use variables
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'tgaur@iitg.ac.in',
        subject: 'We heard that you deleted your account!',
        text: `Hi ${name}, we hope you'are all right. We are so sorry to see you leaving us. Please let us know how we could have made you stay longer. Bye Bye :(`

    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
