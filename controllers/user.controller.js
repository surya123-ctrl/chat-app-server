const User = require('../models/user.model');
const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        console.log(allUsers);
        res.status(200).json(allUsers);
    }
    catch (error) {
        console.log("Error in getUsersForSideBar ", error.message);
        res.status(500).send("Internal Server Error");
    }
}
module.exports = getUsersForSideBar;