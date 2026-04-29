import { useState } from "react"
import SignUpForm from "./forms/SignUpForm";
import LoginForm from "./forms/LoginForm";

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

    return (
        <>
            {logginForm && <LoginForm /> || <SignUpForm />}
            <div id="signin-button-toggle" className="flex flex-row-reverse gap-2" onClick={formToggle}>
                {
                    logginForm
                    && <p>You don't have an account? So register it!</p>
                    || <p>You have an account? So loggin!</p>
                }
            </div >
        </>
    )
}
