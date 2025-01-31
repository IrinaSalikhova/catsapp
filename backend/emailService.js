const nodemailer = require("nodemailer");
require("dotenv").config(); //remove for deployment?
const fs = require("fs-extra");
const handlebars = require("handlebars");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});


const loadTemplate = async (templateName, data) => {
    try {
        const templatePath = `./backend/emailTemplates/${templateName}.html`;
        const source = await fs.readFile(templatePath, "utf8");
        const template = handlebars.compile(source);
        return template(data);
    } catch (error) {
        console.error("Error loading email template:", error);
        return "";
    }
};


const sendEmail = async (to, subject, templateName, data) => {
    try {
        const html = await loadTemplate(templateName, data);
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `https://https://catsformap.uc.r.appspot.com/reset-password/${token}`;
    await sendEmail(
        email,
        "Password Reset Request",
        "passwordReset",
        {
            resetLink: resetLink,
        }
    );
};

module.exports = {sendEmail, sendPasswordResetEmail};