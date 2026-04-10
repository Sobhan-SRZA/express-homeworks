const crypto = require('crypto');

// یک کلید مخفی برای تولید salt و امضای توکن (بهتره این رو از متغیرهای محیطی بخونی)
const SECRET_KEY = 'thisIs-SecretKeyof*cryptiNgTh(**is ShIt%#12';

/**
 * تابع برای هش کردن رمز عبور با استفاده از crypto و salt
 * @param {string} password - رمز عبوری که کاربر وارد کرده
 * @returns {string} - هش شده رمز عبور
 */
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex'); // تولید یک salt تصادفی
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex'); // هش کردن با PBKDF2

    return `${salt}:${hashedPassword}`; // ذخیره salt و هش در کنار هم
}

/**
 * تابع برای مقایسه رمز عبور وارد شده با هش ذخیره شده
 * @param {string} storedHash - هش رمز عبوری که از قبل در دیتابیس ذخیره شده (شکل salt:hashedPassword)
 * @param {string} providedPassword - رمز عبوری که کاربر در فرم ورود وارد کرده
 * @returns {boolean} - true اگر رمز عبور مطابقت داشت، false در غیر این صورت
 */
function verifyPassword(storedHash, providedPassword) {
    const [salt, hashedPassword] = storedHash.split(':');
    const providedHash = crypto.pbkdf2Sync(providedPassword, salt, 10000, 64, 'sha512').toString('hex');

    return providedHash === hashedPassword;
}

const base64UrlEncode = (str) => Buffer.from(str).toString('base64url');

/**
 * تابع برای ساخت توکن JWT-like
 * @param {object} payload - اطلاعاتی که می‌خواهیم در توکن قرار دهیم (مثلاً { userId: '123', username: 'testuser' })
 * @returns {string} - توکن امضا شده
 */
function generateToken(payload) {
    payload.expire = Date.now() + 900_000;

    const header = { alg: 'HS256', typ: 'JWT' };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signature = crypto.createHmac('sha256', SECRET_KEY)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');

    const signedToken = `${encodedHeader}.${encodedPayload}.${base64UrlEncode(signature)}`;

    return signedToken;
}

/**
 * تابع برای وریفای کردن توکن
 * @param {string} token - توکن دریافتی از کلاینت
 * @returns {object | null} - payload توکن اگر معتبر بود، null در غیر این صورت
 */
function verifyToken(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    const calculatedSignature = crypto.createHmac('sha256', SECRET_KEY)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');

    try {
        if (crypto.timingSafeEqual(Buffer.from(signature, "base64url"), Buffer.from(calculatedSignature))) {
            const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString("utf8"));

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