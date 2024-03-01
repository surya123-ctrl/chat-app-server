const express = require('express');
const app = express();
const env = require('dotenv');
env.config();
const connectionDatabase = require('./db/connectionDatabase');
const authRoutes = require('./routes/auth.routes');

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, () => {
    connectionDatabase();
    console.log(`Server is running at ${PORT}`);
})