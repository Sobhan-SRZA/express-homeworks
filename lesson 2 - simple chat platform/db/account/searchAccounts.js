const {
    QuickDB,
    JSONDriver
} = require("quick.db");

const db = new QuickDB({
    driver: new JSONDriver()
})

/**
 * جستجوی حرفه‌ای با چند نتیجه مشابه
 * @param {string} search متن جستجو
 * @param {number} limit حداکثر تعداد نتایج
 * @returns {Promise<Array<{username: string; id: string;}>>}
 */
module.exports = async (search, limit = 10) => {
    try {
        if (!search || typeof search !== "string")
            return [];

        const q = search.toLowerCase().trim();

        const accounts = await db.table("accounts").all();
        if (!accounts || accounts.length === 0)
            return [];

        let results = [];

        for (const a of accounts) {
            const user = a.value;
            const username = user.username.toLowerCase();

            let score = 0;

            // قانون اول: exact match = امتیاز بالا
            if (username === q)
                score += 100;

            // قانون دوم: ID match
            if (a.id === search)
                score += 95;

            // قانون سوم: شروع با
            if (username.startsWith(q))
                score += 50;

            // قانون چهارم: شامل
            if (username.includes(q))
                score += 30;

            // قانون پنجم: fuzzy-light  
            // تشخیص شباهت با اختلاف 1-2 حرف
            if (levenshtein(username, q) <= 2)
                score += 15;

            if (score > 0) {
                results.push({
                    username: user.username,
                    id: a.id,
                    score
                });
            }
        }

        results.sort((a, b) => b.score - a.score);

        return results
            .slice(0, limit)
            .map(r => (
                {
                    username: r.username,
                    id: r.id
                }
            ));
    }

    catch (error) {
        console.log("Error searching accounts from database:", error)

        return [];
    }
}

/**
 * فاصله Levenshtein – برای fuzzy matching
 * فاصله بین دو string را اندازه‌گیری می‌کند.
 */
function levenshtein(a, b) {
    const matrix = [];

    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            
            else {
                matrix[i][j] =
                    Math.min(matrix[i - 1][j - 1] + 1,
                        Math.min(matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1));
            }
        }
    }

    return matrix[b.length][a.length];
}