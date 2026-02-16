

export const sendEmail = async ({ email, subject, message }) => {
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY, 
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "MockInterview",
          email: process.env.BREVO_USER, 
        },
        to: [{ email }],
        subject,
        htmlContent: message,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const data = await res.json();
    console.log("Email sent:", data);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
};
