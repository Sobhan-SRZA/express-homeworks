const crypto = require("crypto");
const SECRET_KEY = "thisIs-SecretKeyof*cryptiNgTh(**is ShIt%#12";

/**
 * 
 * @param {string} password 
 * @returns {string} 
 */
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

    return `${salt}:${hashedPassword}`;
}

/**
 * 
 * @param {string} storedHash 
 * @param {string} providedPassword 
 * @returns {boolean}
 */
function verifyPassword(storedHash, providedPassword) {
    const [salt, hashedPassword] = storedHash.split(":");
    const providedHash = crypto.pbkdf2Sync(providedPassword, salt, 10000, 64, "sha512").toString("hex");

    return providedHash === hashedPassword;
}

const base64UrlEncode = (str) => Buffer.from(str).toString("base64url");

/**
 * 
 * @param {object} payload 
 * @returns {string} 
 */
function generateToken(payload) {
    payload.expire = Date.now() + 900_000;

    const header = { alg: "HS256", typ: "JWT" };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signature = crypto.createHmac("sha256", SECRET_KEY)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64url");

    const signedToken = `${encodedHeader}.${encodedPayload}.${base64UrlEncode(signature)}`;

    return signedToken;
}

/**
 * 
 * @param {string} token 
 * @returns {{username: string; id: string; created_at: number; expire: number;} | null} 
 */
function verifyToken(token) {
    const parts = token.split(".");
    if (parts.length !== 3) {
        return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    const calculatedSignature = crypto.createHmac("sha256", SECRET_KEY)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64url");

    try {
        if (crypto.timingSafeEqual(Buffer.from(signature, "base64url"), Buffer.from(calculatedSignature))) {
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


module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken
};