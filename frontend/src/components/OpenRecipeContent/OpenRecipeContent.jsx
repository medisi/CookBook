import React, { useEffect, useState } from "react";
import './OpenRecipeContent.css';
import useSettings from "../../hooks/useSettings";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const OpenRecipeContent = ({ id, image, title, description, time, cup, ingredients, steps  }) => {

    const [ showDeleteModal, setShowDeleteModal ] = useState(false);
    const { theme, language } = useSettings();
    const lang = language;
    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);
    document.title = `CookBook | ${lang === 'ru' ? 'Рецепт' : 'Recipe'} - ${title}`;

    const imageSrc = image
        ? `http://localhost:5000/uploads/${image}`
        : require('../../assets/images/food.png');
    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/');
    };

    let resultTime = '';
    if (time >= 60) {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        resultTime = `${hours} ${lang === 'ru' ? 'ч' : 'h'} ${minutes} ${lang === 'ru' ? 'мин' : 'min'}`;
    } else {
        resultTime = `${time} ${lang === 'ru' ? 'мин' : 'min'}`;
    };

    const handleDelete = async () => {
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        try {
            await api.delete(`/recipes/${id}`);
            navigate('/');
        } catch (err) {
            console.log(lang === 'ru' ? 'Ошибка удаления: ' : 'Delete error: ', err);
            alert(lang === 'ru' ? 'Ошибка удаления рецепта' : 'Recipe deletion error');
        } finally {
            setShowDeleteModal(false);
        }
    };
    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    return (
        <>
            <div className="openrecipe-container">
                <div className="openrecipe-form">
                    <button className="btn-back" onClick={handleBack}>
                        <img src={require('../../assets/icons/arrow.png')} alt="" />
                    </button>
                    <button className="btn-trash" onClick={handleDelete}>
                        <img src={require('../../assets/icons/trash.png')} alt="" />
                    </button>

                    <div className="openrecipe-form-image">
                        <img src={imageSrc} alt="" />
                    </div>
                    <h1 className="openrecipe-form-title">{title}</h1>
                    {description && (   
                        <div className="openrecipe-form-description">{description}</div>
                    )}
                    <div className="openrecipe-form-cuptime">
                        <div className="openrecipe-form-cuptime-item">
                            <img src={require('../../assets/icons/oclock.png')} alt="" />
                            <span>{resultTime}</span>
                        </div>
                        <div className="openrecipe-form-cuptime-item">
                            <img src={require('../../assets/icons/cup.png')} alt="" />
                            <span>{cup} {lang === 'ru' ? 'порц.' : 'por.'}</span>
                        </div>
                    </div>
                    <table className="openrecipe-form-table">
                        <thead>
                            <tr className="openrecipe-form-table-th">
                                <th className="table-number-one">№</th>
                                <th>{lang === 'ru' ? 'Ингредиент' : 'Ingredient'}</th>
                                <th>{lang === 'ru' ? 'Количество' : 'Quantity'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingredients && ingredients.map((ing, index) => (
                                <tr key={index} className="openrecipe-form-table-td">
                                    <td className="table-number-one">{index + 1}</td>
                                    <td>{ing.name}</td>
                                    <td>{ing.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <table className="openrecipe-form-table">
                        <thead>
                            <tr className="openrecipe-form-table-th">
                                <th className="table-number-one">№</th>
                                <th className="th-step">{lang === 'ru' ? 'Шаг приготовления' : 'The cooking step'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps && steps.map((step, index) => (
                                <tr key={index} className="openrecipe-form-table-td step">
                                    <td className="table-number-one">{index + 1}</td>
                                    <td>{step.step}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showDeleteModal && (
                <div className="deletemodal">
                    <div className="deletemodal-content">
                        <p>{lang === 'ru' ? 'Вы уверены, что хотите удалить этот рецепт?' : 'Are you sure you want to delete this recipe?'}</p>
                        <div className="deletemodal-btns">
                            <button className="confirm" onClick={confirmDelete}>Да</button>
                            <button className="cancel" onClick={cancelDelete}>Нет</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OpenRecipeContent;