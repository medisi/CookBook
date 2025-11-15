import React from "react";
import './RecipeCard.css';
import useSettings from "../../../hooks/useSettings";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ title, text, time, cup, image, id }) => {
    const { language } = useSettings();
    const lang = language;

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/open_recipe/${id}`);
    };

    const imageSrc = image 
        ? `http://localhost:5000/uploads/${image}`
        : require('../../../assets/images/food.png');

    let resultTime = '';
    if (time >= 60) {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        resultTime = `${hours} ${lang === 'ru' ? 'ч' : 'h'} ${minutes} ${lang === 'ru' ? 'мин' : 'min'}`;
    } else {
        resultTime = `${time} ${lang === 'ru' ? 'мин' : 'min'}`;
    }

    return (
        <>
            <div className="recipes-card-container" onClick={handleClick}>
                <div className="recipes-card-container-image">
                    <img src={imageSrc} alt={title} />
                </div>
                <div className="recipes-card-container-info">
                    <div className="recipes-card-container-info-title">
                        <span>{title}</span>
                    </div>
                    <div className="recipes-card-container-info-description">
                        <span>{text}</span>
                    </div>
                    <div className="recipes-card-container-info-text">
                        <div className="recipes-card-container-info-text-item">
                            <img src={require('../../../assets/icons/oclock.png')} alt="" />
                            <span>{resultTime}</span>
                        </div>
                        <div className="recipes-card-container-info-text-item">
                            <img src={require('../../../assets/icons/cup.png')} alt="" />
                            <span>{cup} {lang === 'ru' ? 'порц.' : 'por.'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecipeCard;