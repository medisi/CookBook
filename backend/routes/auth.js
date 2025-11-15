const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// генерация уникального nickname
const generateUniqueNickname = async () => {
  let nickname;
  let isUnique = false;
  while (!isUnique) {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    nickname = `user${randomDigits}`;
    const existingUser = await User.findOne({ nickname });
    if (!existingUser) {
      isUnique = true;
    }
  }
  return nickname;
};

router.post('/register', async (req, res) => {
    try {
        const { username, phone, email, password } = req.body;
        if (!username || !phone || !email || !password) return res.status(400).json({ message: 'ВСе поля обязательно' });

        const existingUser = await User.findOne({ $or: [{ email }, {phone}] });
        if (existingUser) return res.status(400).json({ message: 'Пользователь с такой почтой или номером телефона уже существует' });

        const nickname = await generateUniqueNickname();

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, phone, email, password: hashedPassword, nickname });
        await user.save();
        res.status(201).json({ message: 'Регистрация успешна', nickname });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Логин
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ message: 'Email/телефон и пароль обязательны' });

    const user = await User.findOne({ 
      $or: [
        { email: login },
        { phone: login },
      ]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, phone: user.phone, nickname: user.nickname },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;