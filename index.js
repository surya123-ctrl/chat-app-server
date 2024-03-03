const express = require('express');
const app = express();
const env = require('dotenv');
const cookieParser = require('cookie-parser');
env.config();
const connectionDatabase = require('./db/connectionDatabase');
const authRoutes = require('./routes/auth.routes');
const messageRoutes = require('./routes/message.routes');
const userRoutes = require('./routes/user.routes');

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, () => {
    connectionDatabase();
    console.log(`Server is running at ${PORT}`);
})