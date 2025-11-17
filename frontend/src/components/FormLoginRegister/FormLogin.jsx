import React, { useContext, useEffect, useState } from "react";
import './FormLoginRegister.css';
import { useLocation, useNavigate } from 'react-router-dom';
import useSettings from "../../hooks/useSettings";
import { AuthContext } from "../../context/AuthContext";
import { Controller, useForm } from "react-hook-form";
import api from "../../services/api";

const FormLogin = () => {
    const { theme, language } = useSettings();
    const lang = language;
    const navigate = useNavigate();
    const location = useLocation();  // Для чтения state
    
    const { register, handleSubmit, formState: { errors }, control } = useForm();
    const [ error, setError ] = useState('');
    const { login } = useContext(AuthContext);

    const [ showAlert, setShowAlert ] = useState(false);
    const [ alertMessageTitle, setAlertMessageTitle ] = useState(null);
    const [ alertMessageText, setAlertMessageText ] = useState(null);
    const [ alertType, setAlertType ] = useState('success');

    const [showPassword, setShowPassword] = useState(false);
    // const [loginValue, setLoginValue] = useState('');

    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);
    document.title = `CookBook | ${lang === 'ru' ? 'Вход в личный кабинет' : 'Login to your personal account'}`;

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

    // Новый useEffect для обработки уведомления после регистрации
    useEffect(() => {
        if (location.state?.message) {
            // setAlertMessageTitle(location.state.title);
            // setAlertMessageText(location.state.message);
            // setShowAlert(true);
            showAlertMessage(
                location.state.title || (lang === 'ru' ? 'Успех' : 'Success'),
                location.state.message,
                'success'
            );
        }
    }, [location.state, lang]);

    const formatPhone = (digits) => {
    if (digits.length === 11) {
        return digits.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
    }
    return digits;
};

const handleLoginChange = (input) => {
    const digitsOnly = input.replace(/\D/g, '');  // Только цифры
    if (digitsOnly.length === 11 && input.replace(/\D/g, '') === digitsOnly) {  // Ровно 11 цифр и нет букв
        return formatPhone(digitsOnly);
    }
    return input;  // Возвращаем как есть для email или частичного номера
};


    const handleClickRegister = () => {
        navigate('/register');
    };

    const onSubmit = async (data) => {
        try {
            console.log('Отправка данных:', data);  // Для отладки
            const response = await api.post('/auth/login', { login: data.login, password: data.password });
            console.log('Ответ:', response.data);  // Для отладки
            login(response.data.token);
            navigate('/', {
                state: {
                    title: lang === 'ru' ? 'Добро пожаловать' : 'Welcome',
                    message: lang === 'ru' ? 'Вы успешно вошли в свой личный кабинет' : 'You have successfully logged into your personal account',
                }
            });
        } catch (err) {
            // setError(err.response?.data?.message || lang === 'ru' ? 'Ошибка входа' : 'Login error');
            console.error('Ошибка:', err);  // Подробная ошибка
            const errorMessage = err.response?.data?.message || (lang === 'ru' ? 'Ошибка входа' : 'Login error');
            showAlertMessage(
                lang === 'ru' ? 'Ошибка' : 'Error',
                errorMessage,
                'error'
            );
        }
    };

    return (
        <>
            <div className="logreg-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="logreg-image">
                        <img src={require('../../assets/images/logo.png')} alt="LOGO" />
                    </div>

                    <h1>{lang === 'ru' ? 'Вход' : 'Login'}</h1>
                    
                    <div className="logreg-input">
                        {/* <input
                            type="text"
                            placeholder={lang === 'ru' ? 'Почта или номер телефона' : 'Email or phone'}
                            value={loginValue}
                            onChange={handleLoginChange}
                            {...register('login', {required: lang === 'ru' ? 'Почта или номер телефона обязателен' : 'Email or phone is required'})}
                        /> */}
                        <Controller
                            name="login"
                            control={control}
                            rules={{ required: lang === 'ru' ? 'Почта или номер телефона обязателен' : 'Email or phone is required' }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    placeholder={lang === 'ru' ? 'Почта или номер телефона' : 'Email or phone'}
                                    onChange={(e) => {
                                        const formatted = handleLoginChange(e.target.value);
                                        field.onChange(formatted);  // Обновляем значение в form
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="logreg-input">
                        <input
                            className="input-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder={lang === 'ru' ? 'Пароль' : 'Password'}
                            {...register('password', {required: lang === 'ru' ? 'Пароль обязателен' : 'The password is required'})}
                        />

                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? (lang === 'ru' ? 'Скрыть пароль' : 'Hide password') : (lang === 'ru' ? 'Показать пароль' : 'Show password')}
                        >
                            <img
                                src={require(`../../assets/icons/eye-${showPassword ? 'close' : 'open'}.png`)}
                                alt={showPassword ? (lang === 'ru' ? 'Скрыть' : 'Hide') : (lang === 'ru' ? 'Показать' : 'Show')}
                            />
                        </button>
                    </div>
                    
                    <div className="logreg-about">
                        <span className="logreg-about-text">{lang === 'ru' ? 'Ещё нет аккаунта?' : "Don't have an account yet?"}</span>
                        <span onClick={handleClickRegister}>{lang === 'ru' ? 'Зарегистрироваться!' : 'Register!'}</span>
                    </div>
                    <div className="logreg-about">
                        <span className="logreg-about-fogget">{lang === 'ru' ? 'Забыли пароль?' : 'Forgot your password?'}</span>
                    </div>

                    <p className="error-text-logreg">{error}</p>

                    <button type="submit" className="btn">{lang === 'ru' ? 'Войти' : 'Login'}</button>
                </form>
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

export default FormLogin;
