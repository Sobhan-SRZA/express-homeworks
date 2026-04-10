
const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    const [username, password] = [
        formData.get("username"),
        formData.get("password")
    ];

    try {
        const res = await fetch(form.action, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const response = await res.json();

        if (res.status === 200) {
            localStorage.setItem("token", response.token)

            location.reload()

            return;
        }


        else {
            openDialogError(response.title, response.message)
            console.error(response)

            return;
        }
    }

    catch (e) {
        console.log(e)
    }
}