const generateRandomNumber = require("./generateRandomNumber");

/**
 * 
 * @param {string} username 
 * @param {string} accoutTimestamp 
 * @returns {string}
 */
module.exports = (username, accoutTimestamp) => {
    username = username.toLowerCase();
    accoutTimestamp = accoutTimestamp.toString();

    const username_chars_code = {
        "0": 36,
        "1": 15,
        "2": 25,
        "3": 35,
        "4": 45,
        "5": 65,
        "6": 75,
        "7": 95,
        "8": 16,
        "9": 26,
        "a": 10,
        "b": 20,
        "c": 30,
        "d": 40,
        "e": 50,
        "f": 60,
        "g": 70,
        "h": 80,
        "i": 90,
        "j": 11,
        "k": 21,
        "l": 31,
        "m": 41,
        "n": 51,
        "o": 61,
        "p": 71,
        "q": 81,
        "r": 91,
        "s": 12,
        "t": 22,
        "u": 32,
        "v": 42,
        "w": 52,
        "x": 62,
        "y": 72,
        "z": 82,
        "_": 18,
        "-": 28,
        ".": 38
    }

    let charsSum = username.split("").map(a => a in username_chars_code && username_chars_code[a]).reduce((a, b) => b + a);
    if (charsSum < 10) {
        charsSum = `${generateRandomNumber(3)}${charsSum}`
    }

    else if (charsSum < 100) {
        charsSum = `${generateRandomNumber(2)}${charsSum}`
    }

    else if (charsSum < 1000) {
        charsSum = `${generateRandomNumber()}${charsSum}`
    }

    let length = username.length;

    if (length < 10) {
        length = `${generateRandomNumber()}${length}`
    }

    const fistCharCode = username_chars_code[username[0]];

    let lastNumTms = +accoutTimestamp[accoutTimestamp.length - 1];
    if (lastNumTms < 1) {
        lastNumTms = 1;
    }

    let accTms = accoutTimestamp.split("").map(a => +a).reduce((a, b) => b + a) * lastNumTms;
    if (accTms < 10) {
        accTms = `${generateRandomNumber(3)}${accTms}`
    }

    else if (accTms < 100) {
        accTms = `${generateRandomNumber(2)}${accTms}`
    }

    else if (accTms < 1000) {
        accTms = `${generateRandomNumber()}${accTms}`
    }

    const userId = `${fistCharCode}${length}${charsSum}${accTms}`

    return Number(userId);
}