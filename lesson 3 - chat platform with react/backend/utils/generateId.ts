import Snowflake from "@persian-caesar/snowflake-id";

export default () => {
    const worderId = process.env.WORKER_ID || 1;

    const snowflake = new Snowflake({
        mid: Number(worderId)
    })

    const id = snowflake.generate();

    return id;
}