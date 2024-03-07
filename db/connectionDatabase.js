const mongoose = require('mongoose');
const connectionDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('Connected to MongoDB Database!');
    }
    catch (error) {
        console.log('Error in connecting to MongoDB Database');
        console.log("Error : ", error)
    }
}
module.exports = connectionDatabase;