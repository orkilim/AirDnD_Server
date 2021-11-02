const express = require("express");
const router = express.Router();
const profilesController = require('../controllers/profile');
//const auth = require("../middleware/auth");

router.put('/update', profilesController.updateProfile);
//router.put('/update', womanController.UpdateWoman);
//router.get('/getguards', womanController.getGuardsFromDB);
router.get('/getAll', profilesController.getAll);

router.post('/signup', profilesController.signup);
router.post('/login', profilesController.login);


module.exports = router;