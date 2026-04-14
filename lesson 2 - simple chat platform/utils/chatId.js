/**
 * 
 * @param {string} u1 
 * @param {string} u2 
 * @returns {string}
 */
module.exports = function (u1, u2) {
    return [u1, u2].sort().join("_");
}