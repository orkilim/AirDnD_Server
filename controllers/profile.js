const Profile = require('../models/profile')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator");
//const date = require('date-and-time');

module.exports = {
    async sendSMS(req, res, next) {
        try {
            const { phoneNumber = null } = req.query;
            const user = await Woman.findOne({ phoneNumber });

            const { guards, username, address } = user
            const client = twilio(TWILIO_SMS_SID, TWILIO_SMS_AUTH_TOKEN)

            await Promise.all(guards.map((contact) => {
                client.messages
                    .create({
                        body: `${username} is in danger! go and help her! she is in ${address}`,
                        from: '+972525080684',
                        to: contact.phoneNumber
                    })
            }))

            const now = new Date();
            const eventDate = date.format(now, 'YYYY/MM/DD HH:mm:ss');

            const event = new Event({ address, eventDate });
            await event.save();

            res.json('sms sent successfully!');
            console.log('sms sent successfully!');

        } catch (err) {
            res.status(404).send('not found or already exist');
        }
    },

    async getGuardsFromDB(req, res, next) {
        const { phoneNumber = null } = req.query;
        const result = await Woman.findOne({ phoneNumber });

        const { guards } = result
        const data = guards.map((curr) => ({
            name: curr.name,
            phone: curr.phoneNumber,
        }))

        if (data) {
            console.log(data);
            res.json(data);
        } else {
            res.status(500).send('not found or already exist');
        }
    },

    async getUser(req, res, next) {
        const user=req.query.name
        try {
            const result = await Profile.find({name:user})
            if (result) {
                console.log("everything's good")
                const temp={
                    code:0,
                    user:result
                }
                return res.status(200).json(temp)
            }
            else{
                console.log("user doesn't exist")
                const temp={
                    code:1,
                    msg:"user doesn't exist"
                }
                return res.status(200).json(temp)
            }
        } catch (error) {
            if (error) {
                res.status(500).json({ code: 1, msg: "problem with getAll is: " + error })
            }
        }

    },

    async updateProfile(req, res, next) {
        
        try {
            let { name,prevName, address = "", allergies = "none", car="don't own", diet = "omnivore", days = [false, false, false, false, false, true, true] } = req.body
            console.log(req.body)
            name = name.toLowerCase()    
            //const profile = new Profile({ name, address, allergies, car, diet, days })
            try {
                const profile = await Profile.findOne({ name: prevName });
                if (!profile) {
                    const myObj = {
                        code: 1,
                        msg: "user does not exist"
                    }
                    return res.status(501).json(myObj)
                }
                
                const result = await Profile.findOneAndUpdate({name:prevName},{name:name,address:address,allergies:allergies,car:car,diet:diet,days:days})
                if (result) {
                    console.log("successfully saved to DB")
                    const myObj = {
                        code: 0,
                        msg: "saving profile or profile changes to DB successful"
                    }
                    return res.status(200).send(myObj)
                }


            } catch (error) {
                if (error)
                    return res.status(501).json({ code: 1, msg: "problem with findOne of mongoose in addProfile is: " + error })
            }


        } catch (error) {
            if (error) {
                console.log("error is: ", error)
                res.status(503).send("problem with addProfile is: " + error)
            }
        }
    },

    async signup(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        let { name = null, password = null } = req.body;
        name = name.toLowerCase()
        try {
            const tmp = await Profile.findOne({ name: name });
            if (tmp) {
                const myObj = {
                    code: 1,
                    msg: "User Already Exists"
                }
                return res.status(500).json(myObj);
            }

            const user = new Profile({ name, password });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            jwt.sign({ user: { id: user.id } }, "randomString",
                (err, token) => {
                    if (err)
                        throw err;
                    res.status(200).json({ token });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(501).json({ code: 2, msg: "Error in saving, try again" });
        }
    },

    async login(req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        let { name = null, password = null } = req.body;
        name = name.toLowerCase()
        try {
            let user = await Profile.findOne({ name: name });
            if (!user)
                res.status(502).json({ code: 1, message: "User Doesn't Exist" });
            console.log("user is", JSON.stringify(user))
            const isMatch = await bcrypt.compare(password, user.password);
            console.log(user.password)
            if (!isMatch)
                res.status(502).send({ code: 2, message: "Incorrect Password !" });

            jwt.sign({ user: { id: user.id } }, "randomString",
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({ token });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(502).send({ code: 3, message: "Server Error" });
        }
    },

}