const Group = require('../models/group')
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const {validationResult} = require("express-validator");
//const date = require('date-and-time');
const Profile = require('../models/profile')
module.exports = {

    async getAll(req, res, next) {

        try {
            const result = await Profile.findOne({ name: req.query.name })
            if (result) {
                console.log("everything's good")
                console.log(result)
                if (result.groups == []) {
                    console.log("inside")
                    const myObj = {
                        code: 1,
                        msg: "no groups for this user yet"
                    }
                    return res.status(200).json(myObj)
                }
                else {
                    const myObj = {
                        code: 0,
                        groups: result.groups
                    }
                    return res.status(200).json(myObj)
                }
            }
        } catch (error) {
            if (error) {
                return res.status(500).send("problem with getAll is: " + error)
            }
        }

    },

    async addGroup(req, res) {

        try {
            const name = req.body.name
            let peopleInGroup = req.body.people
            const userName = req.body.userName
            peopleInGroup.push(userName)
            const result = await Group.findOne({ name: name })
            if (result) {
                console.log("group already exists")
                return res.status(200).json({ code: 2, msg: "group already exists" })
            }
            const group = new Group({ name: name, people: peopleInGroup })
            await group.save()
            for (const person in peopleInGroup) {
                const user = await Profile.findOne({ name: userName })
                if (!user) {
                    console.log("couldn't find ", person)
                }
                else {
                    user.groups = [...user.groups, name]
                    await user.save()
                }
            }
            return res.status(200).json({ code: 0, msg: "group successfully created" })

            console.log("new group created successfully")
            return res.status(200).json({ code: 3, msg: "new group created successfully" })
        } catch (error) {
            if (error) {
                console.log("error in addGroup in group controller is: ", error)
                const myObj = {
                    code: 1,
                    msg: error
                }
                return res.status(501).json(myObj)
            }
        }
    }


}