const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  console.log("Sending email to:", to); // Log the recipient email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ruleraditya1911@gmail.com", // Your Gmail address
      pass: "poqs qsih yqgb bcfd", // Your app-specific password
    },
  });

  const mailOptions = {
    from: "ruleraditya1911@gmail.com", // Sender's email
    to, // Dynamic recipient email passed as argument
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
