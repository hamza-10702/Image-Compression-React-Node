const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { user } = require("../helper");

async function sendMail(data) {
  let config = {
    service: "gmail",
    auth: {
      user: user.EMAIL,
      pass: user.PASS,
    },
  };

  let transporter = nodemailer.createTransport(config);
  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });

  const emailTemplate = {
    body: {
      name: `Dear User`,
      intro: `Thank you for using our service. your images are succesfully compressed.`,
      table: {
        data: [],
      },
      outro: "You can get your images any time from our Application.",
    },
  };

  data?.urls?.forEach((url) => {
    emailTemplate.body.table.data.push({ URL: url });
  });

  let mail = MailGenerator.generate(emailTemplate);
  let message = {
    from: user.EMAIL,
    to: data?.email,
    subject: "Compress Images",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then((msg) => {
      // console.log("Mail Message", msg);
      return;
    })
    .catch((error) => {
      //   console.log(error);
      return;
    });
}

module.exports = {
  sendMail,
};
