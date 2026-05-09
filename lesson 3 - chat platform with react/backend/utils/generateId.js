const { default: SnowflakeId } = require("snowflake-id");

/**
 * 
 * @returns {string}
 */
module.exports = () => {
    const worderId = process.env.WORKER_ID || 1;

    const snowflake = new SnowflakeId({
        mid: worderId
    })

    const id = snowflake.generate();

    return BigInt(id);
}