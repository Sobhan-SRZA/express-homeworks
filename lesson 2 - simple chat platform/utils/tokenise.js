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
    const generateToken = `${generatedUsername}.${encodeToken(`${generatedPassword}-${Date.now() + 900_000}`, 24)}`;

    return generateToken;
}

/**
 * 
 * @param {string} token
 * @returns {string}
 */
const decodeAuthentication = (token) => {
    const [encodedUsername, nextToken] = token.split(".");
    const username = decodeToken(encodedUsername);
    const [password, timestamp] = decodeToken(nextToken).split("-");

    return {
        username,
        password,
        timestamp
    };
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


/**
 * 
 * @param {string} content 
 * @returns {string}
 */
const decodeToken = (content) => {
    return Buffer(content, "base64")
        .toString();
}

module.exports = {
    encodeUsername,
    encodePassword,

    encodeAuthentication,
    decodeAuthentication,

    encodeToken,
    decodeToken
}