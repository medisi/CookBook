import React, { useContext, useEffect, useRef, useState } from "react";
import './FormAdding.css';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import useSettings from "../../hooks/useSettings";

const FormAddRecipe = () => {

    const [ categories, setCategories ] = useState([]);
    const [ ingredients, setIngredients ] = useState([{ name: '', quantity: '' }]);
    const [ steps, setSteps ] = useState([{ step: '' }]);
    const [ file, setFile ] = useState(null);
    const [ imagePreview, setImagePreview ] = useState(null);

    const [ error, setError ] = useState('');
    const [ success, setSuccess ] = useState('');
    const [ isLoading, setIsLoading ] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
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
        document.title = `CookBook | ${lang === 'ru' ? 'Новый рецепт' : 'New recipe'}`;
    }, [theme, lang]);

    // добаление новой строки для ингредиентов
    const addIngredientRow = () => {
        setIngredients([ ...ingredients, { name: '', quantity: '' } ]);
    };
    // обновление ингредиента
    const updateIngredient = ( index, field, value ) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };
    // добаление новой строки для шагов
    const addStepRow = () => {
        setSteps([ ...steps, { step: '' } ]);
    };
    // обновление ингредиента
    const updateStep = ( index, value ) => {
        const updated = [...steps];
        updated[index].step = value;
        setSteps(updated);
    };
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (err) {
                console.log(`${lang === 'ru' ? 'Ошибка загрузки категорий' : 'Category loading error'}: `, err);
            }
        };
        if (user) fetchCategories();
    }, [user]);
    // отправка формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError(`${lang === 'ru' ? 'Необходимо войти в систему' : 'You need to log in to the system'}`);
            return;
        }
        setIsLoading(true);

        const form = e.target;
        const title = form.elements.title.value;
        const category = form.elements.category.value;
        const description = form.elements.description.value;
        const prepTime = parseInt(form.elements.time.value);
        const servings = parseInt(form.elements.cup.value);

        // Фильтруем пустые и проверяем
        const filteredIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity.trim());
        const filteredSteps = steps.filter(step => step.step.trim());
        if (filteredIngredients.length === 0 || filteredSteps.length === 0) {
            setError(`${lang === 'ru' ? 'Добавьте хотя бы один ингредиент и шаг' : 'Add at least one ingredient and step'}`);
            return;
        }

        if (prepTime <= 0 && servings <= 0) {
            setError(`${lang === 'ru' ? 'Время и порции должны быть больше 0' : 'The time and portions must be greater than 0'}`);
            return;
        }

        // Используем FormData для файла
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('prepTime', prepTime);
        formData.append('servings', servings);
        formData.append('ingredients', JSON.stringify(filteredIngredients));
        formData.append('steps', JSON.stringify(filteredSteps));
        if (file) {
            formData.append('file', file);  // Добавляем файл
        }
        try {
            const response = await api.post('/recipes', formData);
            setSuccess(`${lang === 'ru' ? 'Рецепт создан успешно' : 'The recipe was created successfully'}`);
            setError('');
            navigate('/');
        } catch (err) {
            console.error(`${lang === 'ru' ? 'Ошибка' : 'Error'}: `, err);  // Лог для диагностики
            // setError(err.response?.data?.message || 'Ошибка создания рецепта');  // Исправлено
            const message = err.response?.data?.message || err.message || `${lang === 'ru' ? 'Ошибка создания рецепта' : 'Recipe creation error'}`;
            setError(message);
            setSuccess('');
        } finally {
            setIsLoading(false);
        }
    };
    const handleFileChange = (e) => {
        // setFile(e.target.files[0]);
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        } else {
            // если файл не выбран - сброс
            setFile(null);
            setImagePreview(null);
        }
    };

    const removeIngredientRow = (index) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        };
    };
    const removeStepRow = (index) => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, i) => i !== index));
        };
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <>
            <div className="addform-container">
                <form onSubmit={handleSubmit} className="addform-form">
                    <button className="btn-back" onClick={handleBack}>
                        <img src={require('../../assets/icons/arrow.png')} alt="" />
                    </button>

                    <h1 className="addform-title">{lang === 'ru' ? 'Новый рецепт' : 'New recipe'}</h1>

                    <div className="addform-image-container">
                        <div className="addform-image">
                            <img src={imagePreview || require(`../../assets/images/${theme === 'light' ? 'food' : 'food-dark'}.png`)} alt="Preview" />
                        </div>
                        <label className="addform-image-upload-btn">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="addform-form-image-input" style={{display: 'none'}} />
                            <span>{lang === 'ru' ? 'Выбрать изображение' : 'Select an image'}</span>
                        </label>
                    </div>

                    <input
                        type="text"
                        name="title"
                        className="addform-form-input addform-form-title"
                        placeholder={`${lang === 'ru' ? 'Наименование блюда' : 'Name of the dish'}`}
                        required
                        ref={input}
                    />
                    
                    <select name="category" className="addform-form-input addform-form-category" required>
                        <option value="">{lang === 'ru' ? 'Категория блюда' : 'Dish category'}</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>

                    <textarea name="description" id="" rows={3} className="addform-form-input addform-form-description" placeholder={`${lang === 'ru' ? 'Описание блюда (необязательно)' : 'Description of the dish (optional)'}`}></textarea>

                    <div className="addform-form-cuptime">
                        <input type="text" name="time" className="addform-form-input addform-form-time" placeholder={`${lang === 'ru' ? 'Время приготовления, мин' : 'Cooking time, min'}`} required />
                        <input type="text" name="cup" className="addform-form-input addform-form-cup" placeholder={`${lang === 'ru' ? 'Количество порций' : 'Number of servings'}`} required />
                    </div>

                    <table className="addform-form-table addform-form-table-ingred">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>{lang === 'ru' ? 'Наименование' : 'Name'}</th>
                                <th>{lang === 'ru' ? 'Количество' : 'Quantity'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients.map((ingredient, index) => (
                                <tr key={index} className="addform-form-table-tbody-tr">
                                    <td>{index + 1}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={ingredient.name}
                                            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                            placeholder={`${lang === 'ru' ? 'Ингредиент': 'Ingredient'}`}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={ingredient.quantity}
                                            onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                                            placeholder={`${lang === 'ru' ? 'Количество': 'Quantity'}`}
                                            required
                                        />
                                    </td>
                                    {ingredients.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeIngredientRow(index)} 
                                            className="remove-btn"
                                        >
                                            ×
                                        </button>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="addform-form-table-btn">
                        <button type="button" className="btn" onClick={addIngredientRow}>{lang === 'ru' ? 'Добавить ингредиент' : 'Add an ingredient'}</button>
                    </div>

                    <table className="addform-form-table addform-form-table-steps">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>{lang === 'ru' ? 'Шаг приготовления' : 'The cooking step'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.map((step, index) => (
                                <tr key={index} className="addform-form-table-tbody-tr">
                                    <td>{index + 1}</td>
                                    <td className="addform-form-table-step-left">
                                        <input
                                            type="text"
                                            value={step.step}
                                            onChange={(e) => updateStep(index, e.target.value)}
                                            placeholder={`${lang === 'ru' ? 'Описание шага' : 'Step description'}`}
                                            required
                                        />
                                    </td>
                                    {steps.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeStepRow(index)} 
                                            className="remove-btn"
                                        >
                                            ×
                                        </button>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="addform-form-table-btn">
                        <button type="button" className="btn" onClick={addStepRow}>{lang === 'ru' ? 'Добавить шаг' : 'Add a step'}</button>
                    </div>
                    
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    {success && <p style={{color: 'green'}}>{success}</p>}

                    <div className="addform-form-btnsubmit">
                        <button type="submit" disabled={isLoading} className="btn">
                            {isLoading ? `${lang === 'ru' ? 'Загрузка...' : 'Loading...'}` : `${lang === 'ru' ? 'Создать рецепт' : 'Create a recipe'}`}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormAddRecipe;