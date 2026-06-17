import {
    useEffect,
    useState
} from "react";
import Application from "./Application";
import AccountForm from "../components/forms/AccountForm";
import backend from "../backend/backend";

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

                || <AccountForm />}
        </>
    )
}