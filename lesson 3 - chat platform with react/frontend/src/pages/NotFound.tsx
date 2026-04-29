import {
    NavLink,
    useLocation,
    useNavigate
} from "react-router-dom";
import {
    useEffect,
    useState
} from "react";
import { Helmet } from "react-helmet";

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [pathLoc, setPathLoc] = useState(location.pathname);

    useEffect(() => {
        if (location.pathname !== "/404") {
            setPathLoc(location.pathname)
            navigate("/404", { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <>
            <Helmet>
                <title>Segraph | Page Not Found</title>
            </Helmet>

            <main
                className={`min-h-min grid rounded-3xl place-items-center px-6 py-24 sm:py-32 lg:px-8 animate-fade-in transition-all ${"ltr"}`}
            >
                <div className="text-center">
                    <p className="text-7xl font-semibold text-(--primary) font-iransans">404</p>
                    <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-(--text) font-iransans">
                        {"Page Not Be Founded"}
                    </h1>

                    <p className="mt-6 text-lg font-medium text-(--text)/70 font-iransans sm:text-xl">
                        {"Sorry, the page you are looking for does not exist."}
                        {pathLoc}
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <NavLink
                            to="/"
                            className="rounded-md bg-(--primary) px-3.5 py-2.5 text-sm font-semibold text-white font-iransans shadow-sm hover:bg-(--primary-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary transition-all"
                            aria-label={"Back to Home"}
                        >
                            {"Back to Home"}
                        </NavLink>
                    </div>
                </div>
            </main>
        </>
    );
};

export default NotFound;

/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */