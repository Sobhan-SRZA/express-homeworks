/**
 * 
 * @param {string} username 
 * @returns {string}
 */
const encodeUsername = (username) => {
    return encodeToken(username, 8);
}

/**
 * 
 * @param {string} password 
 * @returns {string}
 */
const encodePassword = (password) => {
    return encodeToken(password, 12);
}

/**
 * 
 * @param {string} username 
 * @param {string} password
 * @returns {string}
 */
const encodeAuthentication = (username, password) => {
    const generatedPassword = encodePassword(password);
    const generatedUsername = encodeUsername(username);
    const generateToken = `${generatedUsername}.${encodeToken(`${generatedPassword}-${Date.now() + 900_000_000}`, 24)}`;

    return generateToken;
}

/**
 * 
 * @param {string} content 
 * @param {number | undefined} length
 * @param {number | undefined} byteOffset
 * @returns {string}
 */
const encodeToken = (content, length = undefined, byteOffset = undefined) => {
    return Buffer
        .from(content, byteOffset, length)
        .toString("base64")
        .replaceAll("=", "");
}

module.exports = {
    encodeUsername,
    encodePassword,
    encodeAuthentication,

    encodeToken,

    /**
     * 
     * @param {string} content 
     * @returns {string}
     */
    decodeToken: (content) => {
        return Buffer(content, "base64")
            .toString();
    }
}