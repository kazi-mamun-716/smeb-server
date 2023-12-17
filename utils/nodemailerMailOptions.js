const mailOptions = (from, to, subject, text) => {
  return {
    from,
    to,
    subject,
    text,
  };
};

module.exports = mailOptions;
