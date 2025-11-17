import React, { useContext, useEffect, useState } from "react";
import './ProfileContent.css';
import useSettings from "../../hooks/useSettings";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfileContent = () => {
    const { theme, language } = useSettings();
    const lang = language;

    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [ userData, setUserData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState('');

    const [ ageText, setAgeText ] = useState('');

    useEffect(() => {
        // Применение темы к body
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme, lang]);
    document.title = `CookBook | ${lang === 'ru' ? 'Твой профиль' : 'Your profile'}`;
    
    const handleQuit = () => {
        logout();
        navigate('/login');
    };

    const handleBack = () => {
        navigate('/');
        localStorage.setItem('actPageCB', 'rec');
    };
    const handleSettings = () => {
        navigate('/settings');
    };
    
    const formatAge = (age, language) => {
        if (!age) return language === 'ru' ? 'не указано' : 'not specified';
        if (language !== 'ru') return `${age} years`;

        const lastDigit = age % 10;     // последняя цифра
        const lastTwoDigits = age % 100;    // возраст

        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return `${age} лет`;
        }
        if (lastDigit === 1) {
            return `${age} год`;
        }
        if (lastDigit >= 2 && lastDigit <= 4) {
            return `${age} года`;
        }
        return `${age} лет`
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                setUserData(response.data);
            } catch (err) {
                setError(lang === 'ru' ? 'Ошибка загрузки профиля' : 'Error loading profile');
                navigate('/login');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="message loading">
                            <span>
                                {lang === 'ru' ? 'Загрузка профиля...' : 'Loading profile...'}
                            </span>
                        </div>
    if (error) return <div className="message error">
                            <span>
                                {error}
                            </span>
                        </div>
    if (!userData) return <div className="message error">
                            <span>
                                {lang === 'ru' ? 'Данные не найдены' : 'No data found'}
                            </span>
                        </div>


    return (
        <>
            <div className="profile">
                <div className="container">
                    <div className="profile-content">
                        <button className="btn-back" onClick={handleBack}>
                            <img src={require('../../assets/icons/arrow.png')} alt="" />
                        </button>
                        <button className="btn-settings" onClick={handleSettings}>
                            <img src={require('../../assets/icons/settings.png')} alt="" />
                        </button>

                        <div className="profile-title">
                            <div className={`profile-title-image ${userData.avatar ? 'personal' : 'default'}`}>
                                <img
                                    src={ userData.avatar ? `http://localhost:5000/uploads/${userData.avatar}` : require('../../assets/icons/icon-profile.png')}
                                    className="default-user-image"
                                    alt="Avatar"
                                />
                            </div>
                            <span className="profile-title-username">{userData.username}</span>
                            {userData.birthDate && (<span className="profile-title-age">{formatAge(userData.age, language)}</span>)}
                        </div>
                        <div className="profile-info">
                            <div className="profile-info-recipe-category">
                                <div className="profile-info-recipe-category-item">
                                    <div className="profile-info-recipe-category-item-number">{userData.recipesCount}</div>
                                    <div className="profile-info-recipe-category-item-text">
                                        {language === 'ru' ? 'рецепта' : 'recipes'}
                                    </div>
                                </div>
                                <div className="profile-info-recipe-category-item">
                                    <div className="profile-info-recipe-category-item-number">{userData.categoriesCount}</div>
                                    <div className="profile-info-recipe-category-item-text">
                                        {language === 'ru' ? 'категорий' : 'categories'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="profile-description">
                            <div className="profile-description-title">{lang === 'ru' ? 'О себе' : 'About me'}</div>
                            <div className="profile-description-text">{userData.description}</div>
                        </div>
                        <div className="btn-quit">
                            <span onClick={handleQuit}>{lang === 'ru' ? 'Выйти' : 'Logout'}</span>
                        </div>
                        <div className="version">©CookBook, 2025 v.0.0.1</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileContent;
