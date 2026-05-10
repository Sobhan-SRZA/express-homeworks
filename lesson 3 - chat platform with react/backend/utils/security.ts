import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import { UserTokenVerify } from "../types/user";

const SECRET_KEY = "thisIs-SecretKeyof*cryptiNgTh(**is ShIt%#12";

function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

    return `${salt}:${hashedPassword}`;
}

function verifyPassword(storedHash: string, providedPassword: string) {
    const [salt, hashedPassword] = storedHash.split(":");
    const providedHash = pbkdf2Sync(providedPassword, salt, 10000, 64, "sha512").toString("hex");

    return providedHash === hashedPassword;
}

const base64UrlEncode = (str: string) => Buffer.from(str).toString("base64url");

function generateToken(payload: UserTokenVerify) {
    payload.expire = Date.now() + 900_000;

    const header = { alg: "HS256", typ: "JWT" };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signature = createHmac("sha256", SECRET_KEY)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64url");

    const signedToken = `${encodedHeader}.${encodedPayload}.${base64UrlEncode(signature)}`;

    return signedToken;
}

function verifyToken(token: string): UserTokenVerify | null {
    const parts = token.split(".");
    if (parts.length !== 3) {
        return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    const calculatedSignature = createHmac("sha256", SECRET_KEY)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64url");

    try {
        if (timingSafeEqual(Buffer.from(signature, "base64url"), Buffer.from(calculatedSignature))) {
            const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));

            return payload;
        }


        else {
            return null;
        }

    }

    catch (e) {
        console.error("Error parsing token payload:", e);

        return null;
    }
}


export {
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken
};