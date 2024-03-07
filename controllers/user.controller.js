const User = require('../models/user.model');
const getUsersForSideBar = async (req, res) => {
    console.log("Hello");
    try {
        const loggedInUserId = req.user._id;
        console.log(`loggedInUserId`, loggedInUserId);
        const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        // console.log(allUsers);
        res.status(200).json(allUsers);
    }
    catch (error) {
        console.log("Error in getUsersForSideBar ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}
module.exports = getUsersForSideBar;