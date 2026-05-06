const { default: SnowflakeId } = require('snowflake-id');

/**
 * 
 * @returns {string}
 */
module.exports = () => {
    const worderId = process.env.WORKER_ID;
    console.log("🚀 ~ worderId:", worderId)
    const snowflake = new SnowflakeId({
        mid: worderId,
        offset: Date.now()
    })

    const id = snowflake.generate();
    console.log("🚀 ~ id:", id)

    console.log("🚀 ~ Number(id):", Number(id))
    return Number(id);
}