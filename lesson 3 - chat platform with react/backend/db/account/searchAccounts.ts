import getUserStatus from "../users/getUserStatus";
import getData from "../../database/commands/getData";

export default (search: string, limit: number = 10) => {
    try {
        if (!search || typeof search !== "string")
            return [];

        const q = search.toLowerCase().trim();

        const accounts = getData("accounts");
        if (!accounts || accounts.length < 1)
            return [];

        let results: {
            username: string;
            id: string;
            score: number;
        }[] = [];

        for (const a of accounts) {
            const user = a.value;
            const username = user.username.toLowerCase();

            let score = 0;

            // 1: exact match
            if (username === q) {
                score += 100;
            }

            // 2: ID match
            if (a.id === search) {
                score += 95;
            }

            // 3: startswith
            if (username.startsWith(q)) {
                score += 50;
            }

            // 4: includes
            if (username.includes(q)) {
                score += 30;
            }

            // 5: fuzzy-light  
            if (levenshtein(username, q) <= 2) {
                score += 15;
            }

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
            .map(r => {
                const status = getUserStatus(r.id);
                if (!status) {
                    throw "Can't get user status."
                }

                return {
                    username: r.username,
                    id: r.id,
                    status: status.online,
                    lastSeen: status.lastSeen
                }
            });
    }

    catch (e) {
        console.error("Error searching accounts from database:", e)

        return [];
    }
}

function levenshtein(a: string, b: string) {
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