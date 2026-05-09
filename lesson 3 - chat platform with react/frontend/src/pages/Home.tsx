import { useEffect, useState } from "react";
import SignInForm from "../components/SignInForm";
import backend from "../backend/backend";
import Application from "./Application";

export default function Home() {
    const [isLoggined, setIsLoggined] = useState(false);

    const [token, setToken] = useState<string | null>(localStorage.getItem("token") || null);

    const fetchAuth = async () => {
        if (token) {
            try {
                const res = await fetch(backend.auth, {
                    method: "get",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (res.status === 200) {
                    setIsLoggined(true)

                    return;
                }

                else {
                    setIsLoggined(false)
                    localStorage.removeItem("token");
                    setToken(null)
                }
            }

            catch (err) {
                console.log(err)
            }
        }
    }

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'token') {
                location.reload();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // @ts-ignore
    useEffect(() => fetchAuth, [isLoggined, localStorage, token]);

    return (
        <>
            {(isLoggined && token)
                && <Application token={token} />
                ||
                <main className="grow custom-container mx-auto flex flex-col justify-center text-center px-4 py-8">
                    <section id="singin-form" className="w-max flex flex-col gap-4 text-center items-center justify-center self-center bg-(--sec-bg) rounded-2xl p-10">
                        <h2 className="font-bold text-2xl">Segraph Best Chat Platform</h2>

                        <SignInForm />
                    </section>
                </main>}
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