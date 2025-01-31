const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorizate');
router.post('/', [authenticate, authorize], staffController.createStaff);
router.delete('/:userId',[authenticate, authorize], staffController.deleteStaff);
router.get('/',[authenticate, authorize], staffController.listStaff);

module.exports = router;