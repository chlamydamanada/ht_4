import jwt, { JwtPayload } from "jsonwebtoken";
import { settings } from "../settings/settings";

export const jwtService = {
  async createRefreshToken(userId: string, deviceId: string) {
    const token = jwt.sign(
      { userId: userId, deviceId: deviceId },
      settings.jwt_secretRT,
      {
        expiresIn: "300 seconds",
      }
    );
    return token;
  },
  async decodeRefreshToken(token: string): Promise<JwtPayload> {
    const result: any = jwt.decode(token);
    return result;
  },
  async getUserIdByRefreshToken(token: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, settings.jwt_secretRT);
      return result.userId;
    } catch (error) {
      console.log("Refresh Token some error");
      return null;
    }
  },
};
