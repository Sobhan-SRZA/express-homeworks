const handleRegisterSubmit = async (e) => {
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

        if (res.status === 201) {
            localStorage.setItem("token", response.token)

            location.reload()
        }

        else if (res.status === 409) {
            openDialogError(response.title, response.message)
        }

        else
            console.error(response)

        return;
    }

    catch (e) {
        console.error(e)
    }
}