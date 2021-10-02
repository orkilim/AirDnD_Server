const express = require("express");
const router = express.Router();
const profilesController = require('../controllers/profile');
//const auth = require("../middleware/auth");

router.post('/add', profilesController.addProfile);
//router.put('/update', womanController.UpdateWoman);
//router.get('/getguards', womanController.getGuardsFromDB);
router.get('/getAll', profilesController.getAll);

//router.post('/signup', womanController.signup);
//router.post('/login', womanController.login);


module.exports = router;