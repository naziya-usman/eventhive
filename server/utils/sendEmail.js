const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.ETHEREAL_HOST,
    port: Number(process.env.ETHEREAL_PORT),
    auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"EventHive" <${process.env.ETHEREAL_USER}>`,
            to,
            subject,
            html,
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('Email preview: ' + previewUrl);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
