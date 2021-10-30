const express = require("express");
const router = express.Router();
const groupsController = require('../controllers/group');
//const auth = require("../middleware/auth");

//router.post('/add', profilesController.addProfile);
router.get('/getAll', groupsController.getAll);


module.exports = router;