const Group = require('../models/group')
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const {validationResult} = require("express-validator");
//const date = require('date-and-time');

module.exports = {
    
    async getAll(req, res, next) {

        try {
            const result = await Group.find()
            if (result) {
                console.log("everything's good")
                res.status(200).send(JSON.stringify(result))
            }
        } catch (error) {
            if (error) {
                res.status(501).send("problem with getAll is: " + error)
            }
        }

    }

    
}