import React, { useEffect, useRef, useState } from "react";
import './SettingsContent.css';
import useSettings from "../../hooks/useSettings";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { HELPS } from "../../utils/data";

const SettingsContent = () => {
    const [ theme, setTheme ] = useState('light');
    const [ language, setLanguage ] = useState('ru');

    const [ userData, setUserData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState('');

    const [ showNameModal, setShowNameModal ] = useState(false);
    const [ showNicknameModal, setShowNicknameModal ] = useState(false);
    const [ showBirthDateModal, setShowBirthDateModal ] = useState(false);
    const [ showPhoneModal, setShowPhoneModal ] = useState(false);
    const [ showEmailModal, setShowEmailModal ] = useState(false);
    const [ showDescriptionModal, setShowDescriptionModal ] = useState(false);
    const [ newUsername, setNewUsername ] = useState('');
    const [ newNickname, setNewNickname ] = useState('');
    const [ newBirthDate, setNewBirthDate ] = useState('');
    const [ newPhone, setNewPhone ] = useState('');
    const [ newEmail, setNewEmail ] = useState('');
    const [ newDescription, setNewDescription ] = useState('');
    const [ updateError, setUpdateError ] = useState('');

    const [ showPasswordModal, setShowPasswordModal ] = useState(false);
    const [ oldPassword, setOldPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');
    const [ confirmNewPassword, setConfirmNewPassword ] = useState('');
    const [ passwordError, setPasswordError ] = useState('');

    const [ openAccordions, setOpenAccordions ] = useState([]);

    const fileInputRef = useRef(null);
    const [ showAlert, setShowAlert ] = useState(false);
    const [ alertMessageTitle, setAlertMessageTitle ] = useState(null);
    const [ alertMessageText, setAlertMessageText ] = useState(null);
    const [ alertType, setAlertType ] = useState('success');
    const showAlertMessage = (title, text, type = 'success') => {
        setAlertMessageTitle(title);
        setAlertMessageText(text);
        setAlertType(type);
        setShowAlert(true);
        const timer = setTimeout(() => {
            setShowAlert(false);
            setAlertMessageTitle(null);
            setAlertMessageText(null);
            setAlertType('success');
        }, 4000);
        return () => clearTimeout(timer);
    };

    const [activeTabSetting, setActiveTabSetting] = useState('one');
    const handleTabSettingClick = (tab) => {
        setActiveTabSetting(tab);
    }

    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/profile');
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile');
                setUserData(response.data);
            } catch (err) {
                setError(language === 'ru' ? 'Ошибка загрузки профиля' : 'Error loading profile');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();

        const savedSettings = localStorage.getItem('CookBookPerson');
        if (savedSettings) {
            const { theme: savedTheme, language: savedLanguage } = JSON.parse(savedSettings);
            setTheme(savedTheme || 'light');
            setLanguage(savedLanguage || 'ru');
        }
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);

    // РЕДАКТИРОВАНИЕ ИМЕНИ
    const handleEditName = () => {
        setNewUsername(userData?.username || '');
        setShowNameModal(true);
        setUpdateError('');
    };
    const confirmUpdateName = async () => {
        if (!newUsername.trim()) {
            setUpdateError(language === 'ru' ? 'Имя обязательно' : 'Name is required');
            return;
        }
        try {
            await api.put('/profile', { username: newUsername });
            setShowNameModal(false);
            const response = await api.get('/profile');
            setUserData(response.data);
            showAlertMessage(
                language === 'ru' ? 'Успешно' : 'Success',
                language === 'ru' ? 'Ваше имя было изменено' : 'Your name has been changed',
                'sucess'
            );
        } catch (err) {
            setUpdateError(err.message?.data?.message || (language === 'ru' ? 'Ошибка обновления' : 'Update error'));
            showAlertMessage(
                language === 'ru' ? 'Ошибка' : 'Error',
                language === 'ru' ? 'Не удалось изменить имя' : "Couldn't change name",
                'error'
            );
        }
    };
    const cancelUpdateName = () => {
        setShowNameModal(false);
        setNewUsername('');
        setUpdateError('');
    };
    // РЕДАКТИРОВАНИЕ НИКНЕЙМА
    const handleEditNickname = () => {
        setNewNickname(userData?.nickname || '');
        setShowNicknameModal(true);
        setUpdateError('');
    };
    const confirmUpdateNickname = async () => {
        if (!newNickname.trim()) {
            setUpdateError(language === 'ru' ? 'Никнейм обязателен' : 'Nickname is required');
            return;
        }
        try {
            await api.put('/profile', { nickname: newNickname });
            setShowNicknameModal(false);
            const response = await api.get('/profile');
            setUserData(response.data);
            showAlertMessage(
                language === 'ru' ? 'Успешно' : 'Success',
                language === 'ru' ? 'Ваш никнейм был изменён' : 'Your nickname has been changed',
                'sucess'
            );
        } catch (err) {
            setUpdateError(err.response?.data?.message || (language === 'ru' ? 'Ошибка обновления' : 'Update error'));
            showAlertMessage(
                language === 'ru' ? 'Ошибка' : 'Error',
                language === 'ru' ? 'Не удалось изменить никнейм' : "Couldn't change nickname",
                'error'
            );
        }
    };
    const cancelUpdateNickname = () => {
        setShowNicknameModal(false);
        setNewNickname('');
        setUpdateError('');
    };
    // РЕДАКТИРОВАНИЕ ДАТЫ РОЖДЕНИЯ
    const handleEditBirthDate = () => {
        setNewBirthDate(userData?.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : '');  // Форматируем для input date
        setShowBirthDateModal(true);
        setUpdateError('');
    };
    const confirmUpdateBirthDate = async () => {
        if (!newBirthDate.trim()) {
            setUpdateError(language === 'ru' ? 'Дата обязательна' : 'Date is required');
            return;
        }
        try {
            await api.put('/profile', { birthDate: newBirthDate });  // Исправлено: отправляем birthDate
            setShowBirthDateModal(false);
            const response = await api.get('/profile');
            setUserData(response.data);
            showAlertMessage(
                language === 'ru' ? 'Успешно' : 'Success',
                language === 'ru' ? 'Ваша дата рождения была изменена' : 'Your birthday has been changed',
                'sucess'
            );
        } catch (err) {
            setUpdateError(err.response?.data?.message || (language === 'ru' ? 'Ошибка обновления' : 'Update error'));
            showAlertMessage(
                language === 'ru' ? 'Ошибка' : 'Error',
                language === 'ru' ? 'Не удалось изменить дату рождения' : "Couldn't change birthday",
                'error'
            );
        }
    };
    const cancelUpdateBirthDate = () => {
        setShowBirthDateModal(false);
        setNewBirthDate('');
        setUpdateError('');
    };
    // РЕДАКТИРОВАНИЕ НОМЕРА ТЕЛЕФОНА
    const handleEditPhone = () => {
        setNewPhone(userData?.phone || '');
        setShowPhoneModal(true);
        setUpdateError('');
    };
    const confirmUpdatePhone = async () => {
        if (!newPhone.trim()) {
            setUpdateError(language === 'ru' ? 'Номер телефона обязателен' : 'Phone is required');
            return;
        }
        try {
            await api.put('/profile', { phone: newPhone });
            setShowPhoneModal(false);
            const response = await api.get('/profile');
            setUserData(response.data);
            showAlertMessage(
                language === 'ru' ? 'Успешно' : 'Success',
                language === 'ru' ? 'Ваш номер телефона был изменён' : 'Your phone has been changed',
                'sucess'
            );
        } catch (err) {
            setUpdateError(err.message?.data?.message || (language === 'ru' ? 'Ошибка обновления' : 'Update error'));
            showAlertMessage(
                language === 'ru' ? 'Ошибка' : 'Error',
                language === 'ru' ? 'Не удалось изменить номер телефона' : "Couldn't change phone",
                'error'
            );
        }
    };
    const cancelUpdatePhone = () => {
        setShowPhoneModal(false);
        setNewPhone('');
        setUpdateError('');
    };
    // РЕДАКТИРОВАНИЕ ПОЧТЫ
    const handleEditEmail = () => {
        setNewEmail(userData?.email || '');
        setShowEmailModal(true);
        setUpdateError('');
    };
    const confirmUpdateEmail = async () => {
        if (!newEmail.trim()) {
            setUpdateError(language === 'ru' ? 'Почта обязательна' : 'Email is required');
            return;
        }
        try {
            await api.put('/profile', { email: newEmail });
            setShowEmailModal(false);
            const response = await api.get('/profile');
            setUserData(response.data);
            showAlertMessage(
                language === 'ru' ? 'Успешно' : 'Success',
                language === 'ru' ? 'Ваша почта была изменена' : 'Your email has been changed',
                'sucess'
            );
        } catch (err) {
            setUpdateError(err.message?.data?.message || (language === 'ru' ? 'Ошибка обновления' : 'Update error'));
            showAlertMessage(
                language === 'ru' ? 'Ошибка' : 'Error',
                language === 'ru' ? 'Не удалось изменить почту' : "Couldn't change email",
                'error'
            );
        }
    };
    const cancelUpdateEmail = () => {
        setShowEmailModal(false);
        setNewEmail('');
        setUpdateError('');
    };
    // РЕДАКТИРОВАНИЕ ПАРОЛЯ
    const handleUpdatePassword = () => {
        setShowPasswordModal(true);
        setPasswordError('');
    };
    const confirmUpdatePassword = async () => {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setPasswordError('Все поля обязательны');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordError('Пароли не совпадают');
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError('Пароль должен быть не менее 6 символов');
            return;
        }

        try {
            await api.put('/profile', { oldPassword, newPassword });
            alert('Пароль успешно изменён');
            setShowPasswordModal(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            showAlertMessage(
                language === 'ru' ? 'Успешно' : 'Success',
                language === 'ru' ? 'Ваш пароль был изменён' : 'Your password has been changed',
                'sucess'
            );
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Ошибка изменения пароля');
            showAlertMessage(
                language === 'ru' ? 'Ошибка' : 'Error',
                language === 'ru' ? 'Не удалось изменить пароль' : "Couldn't change password",
                'error'
            );
        }
    };
    const cancelUpdatePassword = () => {
        setShowPasswordModal(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setPasswordError('');
    };
    // РЕДАКТИРОВАНИЕ ОПИСАНИЯ ПОЛЬЗОВАТЕЛЯ
    const handleEditDescription = () => {
        setNewDescription(userData?.description || '');
        setShowDescriptionModal(true);
        setUpdateError('');
    };
    const confirmUpdateDescription = async () => {
        if (!newDescription.trim()) {
            setUpdateError(language === 'ru' ? 'Описание обязательно' : 'Description is required');
            return;
        }
        try {
            await api.put('/profile', { description: newDescription });
            setShowDescriptionModal(false);
            const response = await api.get('/profile');
            setUserData(response.data);
            showAlertMessage(
                language === 'ru' ? 'Успешно' : 'Success',
                language === 'ru' ? 'Ваше описание было изменено' : 'Your description has been changed',
                'sucess'
            );
        } catch (err) {
            setUpdateError(err.message?.data?.message || (language === 'ru' ? 'Ошибка обновления' : 'Update error'));
            showAlertMessage(
                language === 'ru' ? 'Ошибка' : 'Error',
                language === 'ru' ? 'Не удалось изменить описание' : "Couldn't change description",
                'error'
            );
        }
    };
    const cancelUpdateDescription = () => {
        setShowDescriptionModal(false);
        setNewDescription('');
        setUpdateError('');
    };

    // функция для рендера звезд
    const renderStars = (count) => {
        return Array.from({ length: count }, (_, i) => (
            <img
                key={i}
                src={require('../../assets/icons/star.png')}
                alt="*"
                style={{ width: '7px', height: '7px', marginRight: '2px' }}
            />
        ));
    };
    // Функции для маскировки данных
    const maskPhone = (phone) => {
        if (!phone) return 'Не указан';
        // return `***${phone.slice(-4)}`;
        return (
            <>
                {renderStars(3)}
                {phone.slice(-5)}
            </>
        );
    };
    const maskEmail = (email) => {
        if (!email) return '';
        const [local, domain] = email.split('@');
        // const maskedLocal = local.length >= 3 ? `${local.slice(0, 3)}***` : `${local}***`;
        const maskedLocal = local.length >= 3 ? local.slice(-3) : local;
        // return `${maskedLocal}@${domain}`;
        return (
            <>
                {renderStars(3)}
                {maskedLocal}
                @{domain}
            </>
        );
    };

    // функция переключения темы с сохранением значения
    const handleToggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        const settings = { theme: newTheme, language};
        localStorage.setItem('CookBookPerson', JSON.stringify(settings));
    };
    // функция смены языка
    const handleToggleLanguage = () => {
        const newLanguage = language === 'ru' ? 'en' : 'ru';
        setLanguage(newLanguage);
        const settings = { theme, language: newLanguage};
        localStorage.setItem('CookBookPerson', JSON.stringify(settings));
    };

    // функция переключения аккордеонов
    const toggleAccordions = (index) => {
        setOpenAccordions(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        )
    };

    // функция для клика на аватар
    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showAlertMessage(
                language === 'ru' ? 'Ошибка' : 'Error',
                language === 'ru' ? 'Выберите изображение' : 'Select an image',
                'error'
            );
            return;
        }
        if (file.size > 15 * 1024 * 1024) {
            showAlertMessage(
                language === 'ru' ? 'Ошибка' : 'Error',
                language === 'ru' ? 'Файл слишком большой (макс 15MB)' : 'File too large (max 15MB)',
                'error'
            );
            return;
        }
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const response = await api.post('/profile/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUserData(prev => ({ ...prev, avatar: response.data.avatar }));
            showAlertMessage(
                language === 'ru' ? 'Успех' : 'Success',
                language === 'ru' ? 'Аватар обновлён' : 'Avatar updated',
                'success'
            );
        } catch (err) {
            console.error('Ошибка загрузки аватара:', err);
            showAlertMessage(
                language === 'ru' ? 'Ошибка' : 'Error',
                language === 'ru' ? 'Ошибка загрузки аватара' : 'Avatar upload error',
                'error'
            );
        }
    };

    document.title = `CookBook | ${language === 'ru' ? 'Настройки' : 'Settings'}`;

    if (loading) return <p>{language === 'ru' ? 'Загрузка...' : 'Loading...'}</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!userData) return <p>{language === 'ru' ? 'Данные не найдены' : 'No data found'}</p>;

    return (
        <>
            <div className="settings">
                <div className="container">
                    <div className="settings_content">
                        <button className="btn-back" onClick={handleBack}>
                            <img src={require('../../assets/icons/arrow.png')} alt="" />
                        </button>

                        <div className="settings_content-title">{language === 'ru' ? 'Настройки' : 'Settings'}</div>
                        {/* tabs settings */}
                        <div className="settings_content-tabs">
                            <div
                                className={`settings_content-tabs-item ${activeTabSetting === 'one' ? 'active' : ''}`}
                                onClick={() => handleTabSettingClick('one')}
                            >
                                {language === 'ru' ? 'Профиль' : 'Profile'}
                            </div>
                            <div
                                className={`settings_content-tabs-item ${activeTabSetting === 'two' ? 'active' : ''}`}
                                onClick={() => handleTabSettingClick('two')}
                            >
                                {language === 'ru' ? 'Система' : 'System'}
                            </div>
                            <div
                                className={`settings_content-tabs-item ${activeTabSetting === 'three' ? 'active' : ''}`}
                                onClick={() => handleTabSettingClick('three')}
                            >
                                {language === 'ru' ? 'Справка' : 'Help'}
                            </div>
                        </div>
                        {/* contents settings */}
                        <div className="settings_content-contents">
                            <div className={`settings_content-contents-card ${activeTabSetting === 'one' ? 'active' : ''}`}>

                                <div className="settings_content-contents-card-item image">
                                    <div className={`settings_content-contents-card-item-value ${userData.avatar ? 'personal' : 'default'}`} onClick={handleAvatarClick}>
                                        <img src={ userData.avatar ? `http://localhost:5000/uploads/${userData.avatar}` : require('../../assets/icons/icon-profile.png')} alt="Avatar" />
                                        <span className="settings-image-text-change">{language === 'ru' ? 'Изменить' : 'Change'}</span>
                                    </div>
                                    <input 
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                <div className="settings_content-contents-card-item">
                                    <div className="settings_content-contents-card-item-title">{language === 'ru' ? 'Имя' : 'Name'}</div>
                                    <div className="settings_content-contents-card-item-value">
                                        <span>{userData.username || ''}</span>
                                        <button onClick={handleEditName}>
                                            <img src={require('../../assets/icons/pen.png')} alt="" />
                                        </button>
                                    </div>
                                </div>
                                <div className="settings_content-contents-card-item">
                                    <div className="settings_content-contents-card-item-title">{language === 'ru' ? 'Никнейм' : 'Nickname'}</div>
                                    <div className="settings_content-contents-card-item-value">
                                        <span>{`@${userData.nickname}`}</span>
                                        <button onClick={handleEditNickname}>
                                            <img src={require('../../assets/icons/pen.png')} alt="" />
                                        </button>
                                    </div>
                                </div>
                                <div className="settings_content-contents-card-item">
                                    <div className="settings_content-contents-card-item-title">{language === 'ru' ? 'Дата рождения' : 'Birthday'}</div>
                                    <div className="settings_content-contents-card-item-value">
                                        {/* <span>{userData.birthDate || (language === 'ru' ? 'не указано' : 'no change')}</span> */}
                                        <span>{userData.birthDate ? new Date(userData.birthDate).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US') : (language === 'ru' ? 'не указано' : 'not specified')}</span>
                                        <button onClick={handleEditBirthDate}>
                                            <img src={require('../../assets/icons/pen.png')} alt="" />
                                        </button>
                                    </div>
                                </div>
                                <div className="settings_content-contents-card-item">
                                    <div className="settings_content-contents-card-item-title">{language === 'ru' ? 'Номер телефона' : 'Phone'}</div>
                                    <div className="settings_content-contents-card-item-value">
                                        <span>{maskPhone(userData.phone)}</span>
                                        <button onClick={handleEditPhone}>
                                            <img src={require('../../assets/icons/pen.png')} alt="" />
                                        </button>
                                    </div>
                                </div>
                                <div className="settings_content-contents-card-item">
                                    <div className="settings_content-contents-card-item-title">{language === 'ru' ? 'Электронная почта' : 'Email'}</div>
                                    <div className="settings_content-contents-card-item-value">
                                        <span>{maskEmail(userData.email)}</span>
                                        <button onClick={handleEditEmail}>
                                            <img src={require('../../assets/icons/pen.png')} alt="" />
                                        </button>
                                    </div>
                                </div>
                                <div className="settings_content-contents-card-item">
                                    <div className="settings_content-contents-card-item-title">{language === 'ru' ? 'Пароль' : 'Password'}</div>
                                    <div className="settings_content-contents-card-item-value">
                                        <span>{renderStars(8)}</span>
                                        <button onClick={handleUpdatePassword}>
                                            <img src={require('../../assets/icons/pen.png')} alt="" />
                                        </button>
                                    </div>
                                </div>
                                <div className="settings_content-contents-card-item about">
                                    <div className="settings_content-contents-card-item-title about">{language === 'ru' ? 'О себе' : 'About me'}</div>
                                    <div className={`settings_content-contents-card-item-value about ${userData.description ? '' : 'none'}`}>
                                        <span>{userData.description ? userData.description : (language === 'ru' ? 'Нет описания' : 'No description')}</span>
                                        <button onClick={handleEditDescription}>
                                            <img src={require('../../assets/icons/pen.png')} alt="" />
                                        </button>
                                    </div>
                                </div>

                            </div>

                            <div className={`settings_content-contents-card ${activeTabSetting === 'two' ? 'active' : ''}`}>
                                <div className="profile-info-settings-item bottom">
                                    <div className="profile-info-settings-item-title">{language === 'ru' ? 'Тёмная тема' : 'Dark theme'}</div>
                                    <button
                                        className={`profile-info-settings-item-button ${theme === 'dark' ? 'active' : ''}`}
                                        onClick={handleToggleTheme}
                                    >
                                        <div className="profile-info-settings-item-button-round"></div>
                                    </button>
                                </div>
                                <div className="profile-info-settings-item">
                                    <div className="profile-info-settings-item-title">{language === 'ru' ? 'Язык' : 'Language'}</div>
                                    <button
                                        className={`profile-info-settings-item-button lang ${language === 'en' ? 'active' : ''}`}
                                        onClick={handleToggleLanguage}
                                    >
                                        <div className="profile-info-settings-item-button-round"></div>
                                        <div className="profile-info-settings-item-button-part one">ру</div>
                                        <div className="profile-info-settings-item-button-part two">en</div>
                                    </button>
                                </div>
                            </div>

                            <div className={`settings_content-contents-card help ${activeTabSetting === 'three' ? 'active' : ''}`}>
                                <div className="settings_content-contents-help-item">
                                    {HELPS.map((item, index) => (
                                        <div className="accordion" key={item.id}>
                                            <div className="accordion-header" onClick={() => toggleAccordions(index)}>
                                                <span>{item.title[language]}</span>
                                                <span className="accordion-icon">{openAccordions.includes(index) ? '-' : '+'}</span>
                                            </div>
                                            {openAccordions.includes(index) && (
                                                <div className="accordion-body">
                                                    <p>{item.about[language]}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* модальное окно для смены имени */}
            {showNameModal && (
                <div className="updatemodal">
                    <div className="updatemodal-content">
                        {updateError && <p style={{ color: 'red' }}>{updateError}</p>}

                        <input
                            type='text'
                            placeholder={language === 'ru' ? 'Новое имя' : 'New name'}
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                        <div className="updatemodal-btns">
                            <button className="confirm" onClick={confirmUpdateName}>{language === 'ru' ? 'Изменить' : 'Change'}</button>
                            <button onClick={cancelUpdateName}>{language === 'ru' ? 'Отмена' : 'Cancel'}</button>
                        </div>
                    </div>
                </div>
            )}
            {/* модальное окно для смены никнейма */}
            {showNicknameModal && (
                <div className="updatemodal">
                    <div className="updatemodal-content">
                        {updateError && <p style={{ color: 'red' }}>{updateError}</p>}
                        <input
                            type='text'
                            placeholder={language === 'ru' ? 'Новый никнейм' : 'New nickname'}
                            value={newNickname}
                            onChange={(e) => setNewNickname(e.target.value)}
                        />
                        <div className="updatemodal-btns">
                            <button className="confirm" onClick={confirmUpdateNickname}>{language === 'ru' ? 'Изменить' : 'Change'}</button>
                            <button onClick={cancelUpdateNickname}>{language === 'ru' ? 'Отмена' : 'Cancel'}</button>
                        </div>
                    </div>
                </div>
            )}
            {/* модальное окно для смены даты рождения */}
            {showBirthDateModal && (
                <div className="updatemodal">
                    <div className="updatemodal-content">
                        {updateError && <p style={{ color: 'red' }}>{updateError}</p>}

                        <input
                            type='date'
                            placeholder={language === 'ru' ? 'Новая дата' : 'New date'}
                            value={newBirthDate}
                            onChange={(e) => setNewBirthDate(e.target.value)}
                        />
                        <div className="updatemodal-btns">
                            <button className="confirm" onClick={confirmUpdateBirthDate}>{language === 'ru' ? 'Изменить' : 'Change'}</button>
                            <button onClick={cancelUpdateBirthDate}>{language === 'ru' ? 'Отмена' : 'Cancel'}</button>
                        </div>
                    </div>
                </div>
            )}
            {/* модальное окно для смены номера телефона */}
            {showPhoneModal && (
                <div className="updatemodal">
                    <div className="updatemodal-content">
                        {updateError && <p style={{ color: 'red' }}>{updateError}</p>}

                        <input
                            type='text'
                            placeholder={language === 'ru' ? 'Новый номер телефона' : 'New phone'}
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                        />
                        <div className="updatemodal-btns">
                            <button className="confirm" onClick={confirmUpdatePhone}>{language === 'ru' ? 'Изменить' : 'Change'}</button>
                            <button onClick={cancelUpdatePhone}>{language === 'ru' ? 'Отмена' : 'Cancel'}</button>
                        </div>
                    </div>
                </div>
            )}
            {/* модальное окно для смены почты */}
            {showEmailModal && (
                <div className="updatemodal">
                    <div className="updatemodal-content">
                        {updateError && <p style={{ color: 'red' }}>{updateError}</p>}

                        <input
                            type='text'
                            placeholder={language === 'ru' ? 'Новая почта' : 'New email'}
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <div className="updatemodal-btns">
                            <button className="confirm" onClick={confirmUpdateEmail}>{language === 'ru' ? 'Изменить' : 'Change'}</button>
                            <button onClick={cancelUpdateEmail}>{language === 'ru' ? 'Отмена' : 'Cancel'}</button>
                        </div>
                    </div>
                </div>
            )}
            {/* модальное окно для смены пароля */}
            {showPasswordModal && (
                <div className="updatemodal">
                    <div className="updatemodal-content">
                        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}

                        <input
                            type="password"
                            placeholder={language === 'ru' ? 'Старый пароль' : 'Old password'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder={language === 'ru' ? 'Новый пароль' : 'New password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder={language === 'ru' ? 'Подтверждение нового пароля' : 'Confirm new password'}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <div className="updatemodal-btns">
                            <button className="confirm" onClick={confirmUpdatePassword}>{language === 'ru' ? 'Изменить' : 'Change'}</button>
                            <button onClick={cancelUpdatePassword}>{language === 'ru' ? 'Отмена' : 'Cancel'}</button>
                        </div>
                    </div>
                </div>
            )}
            {/* модальное окно для смены описания пользователя */}
            {showDescriptionModal && (
                <div className="updatemodal">
                    <div className="updatemodal-content">
                        {updateError && <p style={{ color: 'red' }}>{updateError}</p>}

                        <textarea
                            rows={3}
                            placeholder={language === 'ru' ? 'Новое описание' : 'New description'}
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}

                        ></textarea>
                        <div className="updatemodal-btns">
                            <button className="confirm" onClick={confirmUpdateDescription}>{language === 'ru' ? 'Изменить' : 'Change'}</button>
                            <button onClick={cancelUpdateDescription}>{language === 'ru' ? 'Отмена' : 'Cancel'}</button>
                        </div>
                    </div>
                </div>
            )}

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

export default SettingsContent;