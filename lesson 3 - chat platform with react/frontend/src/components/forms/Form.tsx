import {
    useEffect,
    useState
} from "react";
import type {
    FormProps,
    InputProbs
} from "./types";
import backend from "../../backend/backend";

export default function Form({ isLoggin, validateForm, loading, setLoading, alert, setAlert }: FormProps) {
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const result = await res.json();
            if (res.status === 200 || res.status === 201) {
                // Show success alert and reset form on successful submission.
                setAlert({ show: true, type: "success", message: result.message });
                form.reset();

                localStorage.setItem("token", result.token);

                return;
            }

            else {
                setAlert({ show: true, type: "error", message: result.message });

                return;
            }
        }

        catch (err) {
            // Handle network or unexpected errors.
            setAlert({ show: true, type: "error", message: "Error registering to your account. Please try again." });

            return;
        }

        finally {
            setLoading(false); // Reset loading state after submission.

            return;
        }
    }

    useEffect(() => {
        if (alert.type === "success" && !alert.show) {
            location.reload();
        }
    }, [alert]);

    const Input = ({ name, label, type, required, placeholder }: InputProbs) => {
        const [inputActiveted, setInputActiveted] = useState<boolean>(false)

        return <div className="flex flex-col">
            <label className={`font-bold text-left transition-all ${!inputActiveted ? "translate-x-2.5 translate-y-9 -z-1 opacity-15" : ""} translate-x-2.5 -translate-y-0.5`} htmlFor={name}>{label}</label>
            <input
                className="w-full p-3 rounded-md bg-(--card-bg) border border-(--border) text-(--text) placeholder:text-(--text)/50 placeholder:transition-all focus:border-(--primary) outline-0 focus:ring-2 focus:ring-(--primary)/50 transition-all"
                type={type || "text"}
                onChange={(e) => {
                    if (e.target.value !== "") {
                        setInputActiveted(true)
                    }

                    else {
                        setInputActiveted(false)
                    }
                }}
                name={name}
                id={name}
                placeholder={placeholder}
                required={required}
            />
        </div >
    }

    return (
        <form className="flex flex-col p-3 gap-4 w-full" id="form" onSubmit={handleFormSubmit} action={`${isLoggin ? backend.login : backend.register}`} method="post">
            <Input
                placeholder="User Name"
                label="User Name"
                name="username"
                type="text"
                required
            />

            <Input
                placeholder="Password"
                label="Password"
                name="password"
                type="password"
                required
            />

            <input
                className="mt-11 cursor-pointer py-3 font-semibold text-black hover:text-white dark:hover:text-black dark:text-white backdrop-blur-2xl border-4 border-(--accent) bg-(--accent-hover)/30 rounded-md shadow-sm hover:bg-(--accent) transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
                value={isLoggin ? "Login" : "Register"}
            />
        </form>
    )
}