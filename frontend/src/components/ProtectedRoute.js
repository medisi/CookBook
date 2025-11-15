import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import useSettings from "../hooks/useSettings";

const ProtectedRoute = ({ children }) => {
    const { language } = useSettings();
    const lang = language;

    const { user, loading } = useContext(AuthContext);
    if (loading) {
        return <div className="message loading">
                    <span>
                        {lang === 'ru' ? 'Загрузка...' : 'Loading...'}
                    </span>
                </div>
    }
    return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;