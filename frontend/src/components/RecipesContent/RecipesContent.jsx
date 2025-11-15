import React, { use, useContext, useEffect, useState } from "react";
import './RecipesContent.css';
import '../Header.css';
import { useLocation, useNavigate } from "react-router-dom";
import useSettings from "../../hooks/useSettings";
import RecipeCard from "./RecipeCard/RecipeCard";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

const RecipesContent = () => {
    const { theme, language } = useSettings();
    const lang = language;

    useEffect(() => {
        // Применение темы к body
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);

    const location = useLocation();
    const navigate = useNavigate();

    const [ showAlert, setShowAlert ] = useState(false);
    const [ alertMessageTitle, setAlertMessageTitle ] = useState(null);
    const [ alertMessageText, setAlertMessageText ] = useState(null);
    const [ alertType, setAlertType ] = useState('success');
    
    const [ recipes, setRecipes ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState('');
    const { user } = useContext(AuthContext);

    const showAlertMessage = (title, text, type = 'success') => {
        setAlertMessageTitle(title);
        setAlertMessageText(text);
        setAlertType(type);
        setShowAlert(true);
        // Автоматическое скрытие через 4 секунды
        const timer = setTimeout(() => {
            setShowAlert(false);
            setAlertMessageTitle(null);
            setAlertMessageText(null);
            setAlertType('success');
        }, 4000);
        return () => clearTimeout(timer);  // Очистка таймера при размонтировании
    };
    // useEffect для обработки уведомления после логина
    useEffect(() => {
        if (location.state?.message) {
            showAlertMessage(
                location.state.title || 'Добро пожаловать',  // По умолчанию на русском, но можно добавить язык
                location.state.message,
                'success'
            );
        }
    }, [location.state]);
    document.title = `CookBook | ${lang === 'ru' ? 'Ваши рецепты' : 'Your recipes'}`;

    const handleLinkPage = () => {
        navigate('/categories');
    };
    const handleLinkProfile = () => {
        navigate('/profile');
    };
    const handleAddForm = () => {
        navigate('/add_recipe');
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await api.get(`/recipes?userId=${user._id}`);
                setRecipes(response.data);
            } catch (err) {
                setError(lang === 'ru' ? 'Ошибка загрузки рецептов' : 'Error uploading recipes');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchRecipes();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="message loading">
                            <span>
                                {lang === 'ru' ? 'Загрузка рецептов...' : 'Loading recipes...'}
                            </span>
                        </div>
    if (error) return <div className="message error">
                            <span>
                                {error}
                            </span>
                        </div>

    return (
        <>
            <header className="header">
                <div className="header_content">
                    <div className="header_logo">
                        <img src={require('../../assets/images/logo.png')} alt="" />
                        <span>CookBook</span>
                    </div>
                    <ul className="header_menu">
                        <li className="header_menu-li active">{lang === 'ru' ? 'Мои рецепты' : 'My recipes'}</li>
                        <li className="header_menu-li" onClick={handleLinkPage}>{lang === 'ru' ? 'Мои категории' : 'My categories'}</li>
                    </ul>
                    <div className="header_profile">
                        <img src={require('../../assets/icons/icon-profile.png')} onClick={handleLinkProfile} alt="" />
                    </div>
                </div>
            </header>
            
            <div className="container">
                <div className={`recipes-content ${recipes.length === 0 ? 'none' : '' }`}>
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe._id}
                                    id={recipe._id}
                                    title={recipe.title}
                                    text={recipe.description}
                                    time={recipe.prepTime}
                                    cup={recipe.servings}
                                    image={recipe.image}
                                />
                            ))
                        ) : (
                            <div className="none-content">
                            <span>У вас пока нет рецептов. Добавьте первый.</span>
                        </div>
                    )}
                
                </div>
            </div>

            <div className="btn-add" onClick={handleAddForm}>
                <span>
                    <img src={require('../../assets/icons/plus.png')} alt="" />
                </span>
            </div>

            {showAlert && (
                <div className={`alert ${alertType === 'error' ? 'alert-error' : 'alert-success'}`}>
                    <div className="alert-image">
                        <img
                            src={require(`../../assets/icons/cat-${alertType === 'error' ? 'error' : 'success'}.png`)}
                            alt={alertType === 'error' ? 'Error' : 'Success'}
                        />
                    </div>
                    <div className="alert-info">
                        <div className="alert-info-title">{alertMessageTitle}</div>
                        <div className="alert-info-text">{alertMessageText}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RecipesContent;