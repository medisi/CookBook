const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// подключение к бд
connectDB();

// маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/profile', require('./routes/profile'));

app.get('/', (req, res) => {
    res.json({ message: 'Backend is running!', status: 'OK' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
