import { JwtPayload } from "jsonwebtoken";
import VerificationCode from "../models/verificationCode";
import { sendMail  } from "../utils/mailer";

export const otpService = async (user : JwtPayload) => {
    
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // Set expiry time to 5 minutes from now
        await VerificationCode.create({ userId: user._id, code: otp, expiryTime });
        const mailOptions = {
            to: user.email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
        };
        await sendMail(mailOptions);
        return { message: "OTP sent successfully" };
};