const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

        // подсчёт количества рецептов и категорий
        const recipesCount = await Recipe.countDocuments({ author: req.user.id });
        const categoriesCount = await Category.countDocuments({ author: req.user.id });

        // расчёт возраста по указанной дате
        let age = null;
        if (user.birthDate) {
            const today = new Date();
            const birth = new Date(user.birthDate);
            age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
        }

        res.json({
            username: user.username,
            nickname: user.nickname,
            birthDate: user.birthDate,
            email: user.email,
            phone: user.phone || '',
            avatar: user.avatar,  // Добавлено: чтобы фронтенд мог показать аватар
            recipesCount,
            categoriesCount,
            age,
            description: user.description
        });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.put('/', authMiddleware, async (req, res) => {
    try {
        const { username, nickname, email, phone, birthDate, description, oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

        // Проверка уникальности nickname
        if (nickname && nickname !== user.nickname) {
            const existingNickname = await User.findOne({ nickname });
            if (existingNickname) return res.status(400).json({ message: 'Этот nickname уже занят' });
            user.nickname = nickname;
        }

        // Проверка уникальности email
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) return res.status(400).json({ message: 'Этот email уже занят' });
            user.email = email;
        }

        // Проверка уникальности phone
        if (phone && phone !== user.phone) {
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) return res.status(400).json({ message: 'Этот номер телефона уже занят' });
            user.phone = phone;
        }

        // проверка старого и нового паролей
        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({ message: 'Необходимо указать старый пароль' });
            }
            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isOldPasswordValid) {
                return res.status(400).json({ message: 'Старый пароль неверный' });
            }
            // хэшируем новый пароль
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
        }

        // обновить другие поля
        if (username) user.username = username;
        if (birthDate) user.birthDate = birthDate;
        if (description) user.description = description;

        await user.save();
        res.json({ message: 'Профиль обновлён' });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Email, phone или nickname уже заняты' });
        } else {
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
});

router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Файл не загружен' });
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
        user.avatar = req.file.filename;
        await user.save();
        res.json({ message: 'Аватар обновлён', avatar: req.file.filename });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка загрузки аватара' });
    }
});

module.exports = router;
