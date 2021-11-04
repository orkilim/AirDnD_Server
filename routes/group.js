const express = require("express");
const router = express.Router();
const groupsController = require('../controllers/group');
//const auth = require("../middleware/auth");

router.post('/add', groupsController.addGroup);
router.get('/getAll', groupsController.getAll);


module.exports = router;