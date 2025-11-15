import React, { useContext, useEffect, useState } from "react";
import './CategoriesContent.css';
import '../Header.css';
import { useLocation, useNavigate } from "react-router-dom";
import useSettings from "../../hooks/useSettings";
import { AuthContext } from "../../context/AuthContext";
import CategoryCard from "./CategoryCard/CategoryCard";
import api from "../../services/api";

const CategoriesContent = () => {
    const { theme, language } = useSettings();
    const lang = language;

    const location = useLocation();
    const navigate = useNavigate();

    const [ showAlert, setShowAlert ] = useState(false);
    const [ alertMessageTitle, setAlertMessageTitle ] = useState(null);
    const [ alertMessageText, setAlertMessageText ] = useState(null);
    const [ alertType, setAlertType ] = useState('success');

    const [ categories, setCategories ] = useState([]);
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
    document.title = `CookBook | ${lang === 'ru' ? 'Ваши категории' : 'Your categories'}`;

    const handleDeleteCategory = async (id) => {
        try {
            await api.delete(`/categories/${id}`);
            setCategories((prevCategories) => prevCategories.filter((category) => category._id !== id));
            showAlertMessage(
                lang === 'ru' ? 'Успех' : 'Success',
                lang === 'ru' ? 'Категория удалена' : 'Category deleted',
                'success'
            );
        } catch (err) {
            console.log(lang === 'ru' ? 'Ошибка удаления' : 'Delete error: ', err);
            showAlertMessage(
                lang === 'ru' ? 'Ошибка' : 'Error',
                lang === 'ru' ? 'Не удалось удалить категорию' : 'Failed to delete category',
                'error'
            );
        }
    };

    const handleLinkPage = () => {
        navigate('/');
    };
    const handleLinkProfile = () => {
        navigate('/profile');
    };
    const handleAddForm = () => {
        navigate('/add_category');
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get(`/categories?userId=${user._id}`);
                setCategories(response.data);
            } catch (err) {
                setError(lang === 'ru' ? 'Ошибка загрузки категорий' : 'Error uploading categories');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchCategories();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="message loading">
                            <span>
                                {lang === 'ru' ? 'Загрузка категорий...' : 'Loading categories...'}
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
                        <li className="header_menu-li" onClick={handleLinkPage}>{lang === 'ru' ? 'Мои рецепты' : 'My recipes'}</li>
                        <li className="header_menu-li active">{lang === 'ru' ? 'Мои категории' : 'My categories'}</li>
                    </ul>
                    <div className="header_profile">
                        <img src={require('../../assets/icons/icon-profile.png')} onClick={handleLinkProfile} alt="" />
                    </div>
                </div>
            </header>
            
            <div className="container">
                <div className={`categories-content ${categories.length === 0 ? 'none' : ''}`}>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                                <CategoryCard
                                    key={category._id}
                                    id={category._id}
                                    name={category.name}
                                   onDelete={handleDeleteCategory} 
                                />
                        ))
                    ) : (
                        <div className="none-content">
                            <span>У вас пока нет категорий. Добавьте первую.</span>
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

export default CategoriesContent;