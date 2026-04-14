/**
 * 
 * @param {number | undefined} length 
 * @returns {number}
 */
module.exports = function (length = 1) {
    if (length <= 0) {
        return 0;
    }

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber;
}