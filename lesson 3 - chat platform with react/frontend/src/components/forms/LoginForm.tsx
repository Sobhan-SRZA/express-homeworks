import backend from "../../backend/backend";

export default function LoginForm({ validateForm, setLoading, setAlert }: any) {
    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Validate form inputs before proceeding.
        if (!validateForm(formData)) {
            setLoading(false);
            return;
        }

        setLoading(true); // Set loading state during submission.
        setAlert({ show: true, type: "loading", message: "sending" }); // Show loading alert.

        const form = e.currentTarget;
        const [username, password] = [
            formData.get("username"),
            formData.get("password")
        ];

        try {
            // Send form data to Google Apps Script endpoint.
            const res = await fetch(form.action, {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const result = await res.json();
            if (result.success) {
                // Show success alert and reset form on successful submission.
                setAlert({ show: true, type: "success", message: "contact_error.message_success" });
                form.reset();
                return;
            }

            else {
                // Handle specific error cases (e.g., timeout).
                if (result.error.includes("30")) {
                    setAlert({ show: true, type: "error", message: "contact_error.message_timeout" });
                    return;
                }

                else {
                    setAlert({ show: true, type: "error", message: result.error || "contact_error.message_error" });
                    return;
                }
            }
        }

        catch (err) {
            // Handle network or unexpected errors.
            setAlert({ show: true, type: "error", message: "contact_error.message_error" });
            return;
        }

        finally {
            setLoading(false); // Reset loading state after submission.
            return;
        }
    }

    return (
        <form className="flex flex-col p-3" id="form" onSubmit={handleLoginSubmit} action={`${backend.login}`} method="post">
            <div>
                <label className="form-label" htmlFor="username">User Name:</label>
                <input className="form-input" type="text" name="username" id="username" required />
            </div>

            <div>
                <label className="form-label" htmlFor="password">Password:</label>
                <input className="form-input" type="password" name="password" id="password" required />
            </div>

            <input className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 font-semibold text-black hover:text-white dark:hover:text-black dark:text-white backdrop-blur-2xl border-4 border-(--accent) bg-(--accent-hover)/30 rounded-md shadow-sm hover:bg-(--accent) transition-all disabled:opacity-60 disabled:cursor-not-allowed" type="submit" value="Login" />
        </form>
    )
}
