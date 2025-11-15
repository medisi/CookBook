import { useEffect, useState } from "react";

const useSettings = () => {
    const [ theme, setTheme ] = useState('light');
    const [ language, setLanguage ] = useState('ru');

    // чтение из localStorage при монтировании
    useEffect(() => {
        const savedSettings = localStorage.getItem('CookBookPerson');
        if (savedSettings) {
            const { theme: savedTheme, language: savedLanguage } = JSON.parse(savedSettings);
            setTheme(savedTheme || 'light');
            setLanguage(savedLanguage || 'ru');
        };
    }, []);

    // функции для обновления с сохранением в localStorage
    const updateTheme = (newTheme) => {
        setTheme(newTheme);
        const settings = { theme: newTheme, language };
        localStorage.setItem('CookBookPerson', JSON.stringify(settings));
    };
    const updateLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        const settings = { theme, language: newLanguage };
        localStorage.setItem('CookBookPerson', JSON.stringify(settings));
    };

    return { theme, language, updateTheme, updateLanguage };
};

export default useSettings;