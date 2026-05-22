const express = require('express');
const router = express.Router();
const { handleChat, getChatHistory } = require('../controllers/chatController');

router.post('/', handleChat);
router.get('/history/:userId', getChatHistory);

module.exports = router;
