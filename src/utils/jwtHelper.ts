import jwt, {JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signToken = (userId: string, email: string, ) : string => {
    return jwt.sign({email, userId}, `${process.env.JWT_SECRET}`, {expiresIn:"1d"});
};

export const verifyToken = (token: string) : string | jwt.JwtPayload => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
};

export const decodeToken = (token: string) : string | jwt.JwtPayload => {
    const decoded = jwt.decode(token) as string | jwt.JwtPayload;
    return decoded;
};