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
                return res.status(200).send(JSON.stringify(result))
            }
        } catch (error) {
            if (error) {
                return res.status(500).send("problem with getAll is: " + error)
            }
        }

    },

    async addGroup(req, res) {

        try {
            const name=req.body.name
            const peopleInGroup=req.body.people
            const group=await Group.findOne({name:name})
            if(group)
            {
                console.log("group already exists")
                return res.status(200).json({code:2,msg:"group already exists"})
            }
            group.save()
            
            console.log("new group created successfully")
            return res.status(200).json({code:3,msg:"new group created successfully"})
        } catch (error) {
            if (error) {
                console.log("error in addGroup in group controller is: ",error)
                const myObj={
                    code:1,
                    msg:error
                }
                return res.status(501).json(myObj)
            }
        }
    }


}