import React, { useState } from "react";
import './CategoryCard.css';
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import useSettings from "../../../hooks/useSettings";

const CategoryCard = ({ id, name, onDelete }) => {
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);
    const { language } = useSettings();
    const lang = language;
    const navigate = useNavigate();

    const handleDelete = async () => {
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        await onDelete(id);
        setShowDeleteModal(false);
    };
    const cancelDelete = () => {
        setShowDeleteModal(false);
    };
    return (
        <>
            <div className="categories-card-container">
                <span>{name}</span>
                <button onClick={handleDelete}>
                    <img src={require('../../../assets/icons/trash.png')} alt="" />
                </button>
            </div>

            {showDeleteModal && (
                <div className="deletemodal">
                    <div className="deletemodal-content">
                        <p>{lang === 'ru' ? 'Вы уверены, что хотите удалить эту категорию?' : 'Are you sure you want to delete this category?'}</p>
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

export default CategoryCard;