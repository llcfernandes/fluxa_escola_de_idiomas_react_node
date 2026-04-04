const router = require('express').Router();
const { sendMessage, contactValidation } = require('../controllers/contact.controller');
router.post('/', contactValidation, sendMessage);
module.exports = router;
