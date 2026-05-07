import { useState } from "react";
import SignInForm from "../components/SignInForm";
import { Dialog, DialogPanel } from "@headlessui/react";

export default function Home() {
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
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const message = formData.get("message") as string;

        // Check if name is at least 3 characters long.
        if (name.length < 3) {
            setAlert({ show: true, type: "error", message: "contact_error.message_name" });
            return false;
        }

        // Validate email format using a regex pattern.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setAlert({ show: true, type: "error", message: "contact_error.message_email" });
            return false;
        }

        // Check if message is at least 5 characters long.
        if (message.length < 5) {
            setAlert({ show: true, type: "error", message: "contact_error.message_message" });
            return false;
        }

        return true; // Return true if all validations pass.
    };

    return (
        <>
            <section id="singin-form" className="custom-container bg-(--sec-bg) rounded-2xl p-4 flex gap-2 text-center items-center justify-center flex-col">
                <SignInForm />
            </section>

            {/* Alert Dialog: Displays success, error, or loading messages */}
            <Dialog
                open={alert.show}
                onClose={() => setAlert({ ...alert, show: false })}
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
                                    /> {/* Checkmark for success */}
                                </svg>
                            )}
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
                                    /> {/* Cross for error */}
                                </svg>
                            )}
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
                                    /> {/* Spinner for loading */}
                                </svg>
                            )}
                        </div>

                        {/* Alert message */}
                        <p className="text-lg text-(--text) mb-6">{alert.message}</p>

                        {/* Close button */}
                        <button
                            onClick={() => setAlert({ ...alert, show: false })}
                            className="cursor-pointer px-6 py-2 font-semibold text-black hover:text-white dark:hover:text-black dark:text-white backdrop-blur-2xl border-4 border-(--accent) bg-(--accent-hover)/30 rounded-md shadow-sm hover:bg-(--accent) transition-all"
                            aria-label={"close"} // Accessible label for screen readers
                        >
                            {"close"} {/* Translated close button text */}
                        </button>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */