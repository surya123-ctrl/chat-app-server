const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        console.log("User id: ", req.user._id);
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        console.log("Conversation", conversation)
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        console.log("Conversation", conversation)
        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })
        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }
        await Promise.all([conversation.save(), newMessage.save()]);
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.log("Error in sendMessage Controller", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        console.log(userToChatId, senderId);
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate("messages");
        if (!conversation) {
            console.log("No conversation");
            return res.status(200).json([]);
        }
        res.status(200).json(conversation.messages);

    }
    catch (error) {
        console.log("Error in getMessage Controller", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { sendMessage, getMessage };