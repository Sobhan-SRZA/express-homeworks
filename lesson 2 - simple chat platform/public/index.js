document.addEventListener("DOMContentLoaded", async () => {
    const is_login = document.querySelector(".is-login");
    const userInfo = is_login.querySelector("#userInfo");
    const not_login = document.querySelector(".not-login");

    const token = localStorage.getItem("token");

    if (token) {
        try {
            const res = await fetch("/api/users/me", {
                method: "get",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 200) {
                location.replace("/app")
                
                return;
            }

            else {
                is_login.style.display = "none";
                userInfo.style.display = "none";
                not_login.style.display = "block";

                // remove token
                localStorage.removeItem("token");
            }
        }

        catch (error) {
            console.error("Authentication failed:", error);

            is_login.style.display = "none";
            not_loginstyle.display = "block";
            userInfo.style.display = "none";
        }
    }

    else {
        is_login.style.display = "none";
        userInfo.style.display = "none";
        not_login.style.display = "block";
    }
})

const logoutProfile = () => {
    localStorage.removeItem("token");
    location.reload()
}