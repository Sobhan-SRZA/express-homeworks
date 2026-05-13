import {
    useLocation,
    useNavigate
} from "react-router-dom";
import { useEffect } from "react";

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        navigate("/", { replace: true });
    }, [location.pathname, navigate]);

    return;
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