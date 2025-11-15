import React, { useEffect, useState } from "react";
import OpenRecipeContent from "../components/OpenRecipeContent/OpenRecipeContent";
import { useParams } from "react-router-dom";
import api from "../services/api";
import useSettings from "../hooks/useSettings";

const OpenRecipe = () => {
    const { language } = useSettings();
    const lang = language;

    const { id } = useParams();
    const [ recipe, setRecipe ] = useState(null);
    const [ loading, setLoading ] = useState(null);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await api.get(`/recipes/${id}`);
                setRecipe(response.data);
            } catch (err) {
                setError('Ошибка загрузки рецепта');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchRecipes();
    }, [id]);

    if (loading) return <div className="message loading">
                            <span>
                                {lang === 'ru' ? 'Загрузка...' : 'Loading...'}
                            </span>
                        </div>
    if (error) return <div className="message error">
                            <span>
                                {error}
                            </span>
                        </div>
    if (!recipe) return <div className="message error">
                            <span>
                                {lang === 'ru' ? 'Рецепт не найден' : 'The recipe was not found'}
                            </span>
                        </div>
                        
    return (
        <>
            <OpenRecipeContent
                id={recipe._id}
                image={recipe.image}
                title={recipe.title}
                description={recipe.description}
                time={recipe.prepTime}
                cup={recipe.servings}
                ingredients={recipe.ingredients}
                steps={recipe.steps}
            />
        </>
    )
};

export default OpenRecipe;