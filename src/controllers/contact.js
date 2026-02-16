import { sendEmail } from "../utils/Email.js";
import { generateContactAutoReplyTemplate, generateContactUsTemplate } from "../utils/TemplateGenerator.js";

export const contactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Message are required",
      });
    }

    
    const adminEmailSent = await sendEmail({
      email: process.env.ADMIN_EMAIL,
      subject: "New Contact Us Message",
      message: generateContactUsTemplate({ name, email, message }),
    });

    if (!adminEmailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send message to admin",
      });
    }

   
    const userEmailSent = await sendEmail({
      email,
      subject: "We’ve received your message – CountryEdu",
      message: generateContactAutoReplyTemplate(name),
    });

    
    if (!userEmailSent) {
      console.warn("Auto-reply email failed for:", email);
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    console.error("ContactUs Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
