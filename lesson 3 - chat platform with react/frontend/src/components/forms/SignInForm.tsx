import {
    Dialog,
    DialogPanel
} from "@headlessui/react";
import { useState } from "react"
import Form from "./Form";

export default function SignInForm() {
    const [logginForm, setLogginForm] = useState(true);

    const formToggle = () => {
        if (logginForm) {
            setLogginForm(false)
        }

        else {
            setLogginForm(true)
        }
    }

    const [loading, setLoading] = useState(false);

    // State to manage alert dialog (success, error, or loading) visibility and content.
    const [alert, setAlert] = useState<{
        show: boolean;
        type: "success" | "error" | "loading";
        message: string;
    }>({
        show: false,
        type: "loading",
        message: ""
    });

    // Function to validate form input before submission.
    const validateForm = (formData: FormData) => {
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        // Check if username is at least 5 characters long.
        if (username.length < 5) {
            setAlert({ show: true, type: "error", message: "Error username must be at least 5 characters." });

            return false;
        }

        // Check if password is at least 8 characters long.
        if (password.length < 8) {
            setAlert({ show: true, type: "error", message: "Error message must be at least 8 characters." });

            return false;
        }

        return true; // Return true if all validations pass.
    };

    return (
        <>
            <Form
                isLoggin={logginForm}
                setAlert={setAlert}
                alert={alert}
                setLoading={setLoading}
                loading={loading}
                validateForm={validateForm}
            />

            <div id="signin-button-toggle" className="flex flex-row-reverse gap-2" onClick={formToggle}>
                {
                    logginForm
                    && <p>You don't have an account? So register it!</p>
                    || <p>You have an account? So loggin!</p>
                }
            </div >

            {/* Alert Dialog: Displays success, error, or loading messages */}
            <Dialog
                open={alert.show}
                onClose={() => setAlert({ ...alert, show: false })}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setAlert({ ...alert, show: false })
                    }
                }}
                className="relative z-50"
            >
                {/* Overlay for the dialog */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel
                        className={`w-full max-w-md rounded-lg bg-(--card-bg)/90 backdrop-blur-md p-6 text-center transform transition-all ${alert.show ? "scale-100 opacity-100" : "scale-95 opacity-0"} ${"font-sans ltr"}`}
                    >
                        {/* Alert icon based on type (success, error, loading) */}
                        <div className="flex justify-center mb-4">

                            {/* Checkmark for success */}
                            {alert.type === "success" && (
                                <svg
                                    className="w-12 h-12 text-green-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}

                            {/* Cross for error */}
                            {alert.type === "error" && (
                                <svg
                                    className="w-12 h-12 text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}

                            {/* Spinner for loading */}
                            {alert.type === "loading" && (
                                <svg
                                    className="w-12 h-12 text-(--primary) animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                                    />
                                </svg>
                            )}
                        </div>

                        {/* Alert message */}
                        <p className="text-lg text-(--text) mb-6">{alert.message}</p>

                        {/* Close button */}
                        <button
                            onClick={() => setAlert({ ...alert, show: false })}
                            className="cursor-pointer px-6 py-2 font-semibold text-black hover:text-white dark:hover:text-black dark:text-white backdrop-blur-2xl border-4 border-(--accent) bg-(--accent-hover)/30 rounded-md shadow-sm hover:bg-(--accent) transition-all"
                            aria-label={"Close"}
                        >
                            {alert.type === "success" ? "OK" : "Close"}
                        </button>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}