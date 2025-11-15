import React, { useContext, useEffect, useState } from "react";
import './FormLoginRegister.css';
import { useNavigate } from 'react-router-dom';
import useSettings from "../../hooks/useSettings";
import { Controller, useForm } from "react-hook-form";
import api from "../../services/api";

const FormRegister = () => {
    const { theme, language } = useSettings();
    const lang = language;
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors }, setValue, trigger, control } = useForm({
        mode: 'onChange'    // валидация в реальном времени
    });
    // const [ error, setError ] = useState('');

    // Состояния для уведомления
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessageTitle, setAlertMessageTitle] = useState(null);
    const [alertMessageText, setAlertMessageText] = useState(null);
    const [alertType, setAlertType] = useState('success');

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);
    document.title = `CookBook | ${lang === 'ru' ? 'Регистрация личного кабинета' : 'Personal account registration'}`

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

    const handlePhoneChange = (event) => {
        const input = event.target;
        let value = input.value.replace(/\D/g, '');  // Только цифры
        if (value.startsWith('7') || value.startsWith('8')) {
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            const maskedValue = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');   // phone format
            return maskedValue;  // Возвращаем отформатированное значение
        } else {
            return '';  // Если не начинается с 7/8, очищаем
        }
    };

    const handleClickLogin = () => {
        navigate('/login');
    };

    const onSubmit = async (data) => {
        const validationErrors = [];
        if (errors.username) validationErrors.push(lang === 'ru' ? 'Имя должно содержать только буквы.' : 'Name must contain only letters.');
        if (errors.username) validationErrors.push(lang === 'ru' ? 'Неверный формат номера телефона.' : 'Invalid phone number format.');
        if (errors.username) validationErrors.push(lang === 'ru' ? 'Неверный формат эл. почты.' : 'Invalid email format.');
        if (errors.username) validationErrors.push(lang === 'ru' ? 'Пароль должен быть длинее 6 символов.' : 'Password must be longer than 6 characters');

        if (validationErrors.length > 0) {
            showAlertMessage(
                lang === 'ru' ? 'Ошибка валидации' : 'Validation error',
                validationErrors.join(' '),
                'error'
            );
            return;
        }

        try {
            await api.post('/auth/register', data);
            navigate('/login', {
                state: {
                    title: lang === 'ru' ? 'Успешно' : 'Success',
                    message: lang === 'ru' ? 'Регистрация прошла успешно. Теперь войдите в систему.' : 'Registration successful! Please log in.'
                }
            });
        } catch (err) {
            const errorMessage = err.response?.data?.message || (lang === 'ru' ? 'Ошибка регистрации' : 'Registration error');
            showAlertMessage(
                lang === 'ru' ? 'Ошибка' : 'Error',
                errorMessage,
                'error'
            )
        }
    };

    return (
        <>
            <div className="logreg-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="logreg-image">
                        <img src={require('../../assets/images/logo.png')} alt="LOGO" />
                    </div>

                    <h1>{lang === 'ru' ? 'Регистрация' : 'Registration'}</h1>
                    
                    <div className="logreg-input">
                        <input
                            type="text"
                            placeholder={lang === 'ru' ? 'Имя' : 'Name'}
                            {...register('username', {
                                required: lang === 'ru' ? 'Имя пользователя обязательно' : "The user's name is required",
                                pattern: {
                                    value: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
                                    message: lang === 'ru' ? 'Имя должно содержать только буквы' : 'Name must contain only letters'
                                }
                            })}
                        />
                    </div>

                    <div className="logreg-input">
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                required: lang === 'ru' ? 'Номер телефона обязателен' : 'The phone is required',
                                validate: (value) => (value && value.replace(/\D/g, '').length === 11) || (lang === 'ru' ? 'Номер телефона должен быть полным' : 'Phone number must be complete')
                            }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="tel"
                                    placeholder={lang === 'ru' ? 'Номер телефона' : 'Phone'}
                                    onChange={(e) => {
                                        const masked = handlePhoneChange(e);
                                        field.onChange(masked);  // Обновляем значение в form
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className="logreg-input">
                        <input
                            type="email"
                            placeholder={lang === 'ru' ? 'Почта' : 'Email'}
                            {...register('email', {
                                required: lang === 'ru' ? 'Почта обязательна' : 'The email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: lang === 'ru' ? 'Неверный формат email' : 'Invalid email format'
                                }
                            })}
                        />
                    </div>
                    <div className="logreg-input">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={lang === 'ru' ? 'Пароль' : 'Password'}
                            {...register('password', {
                                required: lang === 'ru' ? 'Пароль обязателен' : 'The password is required',
                                minLength: {
                                    value: 6,
                                    message: lang === 'ru' ? 'Пароль должен быть длиннее 6 символов' : 'Password must be longer than 6 characters'
                                }
                            })}
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
                        <span className="logreg-about-text">{lang === 'ru' ? 'Уже есть аккаунт?' : "Do ypu already have an account?"}</span>
                        <span onClick={handleClickLogin}>{lang === 'ru' ? 'Войти!' : 'Login!'}</span>
                    </div>

                    {/* <p className="error-text-logreg">{error}</p> */}

                    <button type="submit" className="btn">{lang === 'ru' ? 'Зарегистрироваться' : 'Register'}</button>
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

export default FormRegister;