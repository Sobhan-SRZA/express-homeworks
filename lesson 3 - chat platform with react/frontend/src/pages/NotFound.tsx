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