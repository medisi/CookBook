import React, { use, useContext, useEffect, useRef, useState } from "react";
import './FormAdding.css';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useSettings from "../../hooks/useSettings";
import api from "../../services/api";

const FormAddCategory = () => {

    const [ error, setError ] = useState();
    const [ success, setSuccess ] = useState();
    const [ isLoading, setIsLoading ] = useState();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const { theme, language, updateTheme, updateLanguage } = useSettings();
    const lang = language;

    const input = useRef();
    useEffect(() => {
        input.current.focus();
    }, []);

    useEffect(() => {
        // Применение темы к body
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        // Установка title
        document.title = `CookBook | ${lang === 'ru' ? 'Новая категория' : 'New category'}`;
    }, [theme, lang]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError(`${lang === 'ru' ? 'Необходимо войти в систему' : 'You need to log in to the system'}`);
            return;
        }
        setIsLoading(true);

        const form = e.target;
        const name = form.elements.title.value;

        console.log('=== Отправка данных ===');
        console.log('name:', name);
        console.log('user.token:', user.token);
        console.log('localStorage token:', localStorage.getItem('token'));
        
        try {
            const response = await api.post('/categories', { name });
            setSuccess(`${lang === 'ru' ? 'Категория добавлена' : 'Category added'}`);
            setError('');
            navigate('/categories');
        } catch (err) {
            console.log(`${lang === 'ru' ? 'Ошибка категории' : 'Category error'}: `, err);
            // const message = err.response?.data?.message || err.message || 'Ошибка создания категории';
            // setError(message);
            setSuccess('');

            console.error(`${lang === 'ru' ? 'Ошибка при добавлении категории' : 'Error when adding a category'}: `, err); // Лучше видеть детали

            let message = `${lang === 'ru' ? 'Ошибка создания категории' : 'Category creating error'}`;

            // 1. Если есть response от сервера
            if (err.response) {
                // a. Если сервер вернул JSON с полем message
                if (err.response.data && typeof err.response.data === 'object') {
                message = err.response.data.message || message;
                }
                // b. Если сервер вернул строку (маловероятно, но возможно)
                else if (typeof err.response.data === 'string') {
                message = err.response.data;
                }
                // c. Если статус 400, но нет message — используем текст статуса
                else {
                message = err.response.statusText || message;
                }
            }
            // 2. Если ошибка на уровне запроса (нет ответа от сервера)
            else if (err.request) {
                message = `${lang === 'ru' ? 'Нет ответа от сервера. Проверьте подключение.' : 'There is no response from the server. Check the connection.'}`;
            }
            // 3. Другие ошибки (например, конфигурация запроса)
            else {
                message = err.message || message;
            }

            setError(message);
            setSuccess('');

        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/categories');
    };

    return (
        <>
            <div className="addform-container">
                <form onSubmit={handleSubmit} className="addform-form">
                    <button className="btn-back" onClick={handleBack}>
                        <img src={require('../../assets/icons/arrow.png')} alt="" />
                    </button>

                    <h1 className="addform-title">{lang === 'ru' ? 'Новая категория' : 'New category'}</h1>

                    <input 
                        type="text"
                        name="title"
                        className="addform-form-input addform-form-title"
                        placeholder={`${lang === 'ru' ? 'Наименование' : 'Name'}`}
                        required
                        ref={input}
                    />
                    
                    
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    {success && <p style={{color: 'green'}}>{success}</p>}

                    <div className="addform-form-btnsubmit">
                        <button type="submit" disabled={isLoading} className="btn">
                            {isLoading ? `${lang === 'ru' ? 'Загрузка...' : 'Loading...'}` : `${lang === 'ru' ? 'Добавить категорию' : 'Add a category'}`}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormAddCategory;