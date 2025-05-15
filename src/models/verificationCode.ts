import mongoose from "mongoose";
import { IVerificationCode } from "../types/models";

const verificationCodeSchema = new mongoose.Schema<IVerificationCode>(
  {
    userId: { type: String, required: true },
    code: { type: Number, required: true },
    expiryTime: { type: Date, required: true, index : {
      expires : 300
    }},
  },
  {
    timestamps: true,
  }
);

const VerificationCode = mongoose.model<IVerificationCode>("VerificationCode", verificationCodeSchema);

export default VerificationCode;