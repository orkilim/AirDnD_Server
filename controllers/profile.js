const Profile = require('../models/profile')
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const {validationResult} = require("express-validator");
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

    async getAll(req, res, next) {

        try {
            const result = await Profile.find()
            if (result) {
                console.log("everything's good")
                res.status(200).send(JSON.stringify(result))
            }
        } catch (error) {
            if (error) {
                res.status(501).send("problem with getAll is: " + error)
            }
        }

    },

    async addProfile(req, res, next) {
        let errorNum=503
        try {
            let { name, address = "", allergies = "none", car, diet = "omnivore", days = [false, false, false, false, false, true, true] } = req.body
            console.log(req.body)
            name=name.toLowerCase()
            errorNum++
            const profile = new Profile({ name, address, allergies, car, diet, days })
            errorNum++
            try {
                errorNum++
                const result = await Profile.findOne({ name:name });
                if (result) {
                    const myObj={
                        code:1,
                        msg:"user with that name already exists- change name or log to the existing"
                    }
                    res.status(200).send(myObj)
                }
                else {
                    const result = await profile.save()
                    if (result) {
                        console.log("successfully saved to DB")
                        const myObj={
                            code:0,
                            msg:"saving profile or profile changes to DB successful"
                        }
                        res.status(200).send(myObj)
                    }
                }

            } catch (error) {
                if (error)
                    res.status(502).send("problem with findOne of mongoose in addProfile is: " + error)
            }


        } catch (error) {
            if (error)
            {
                console.log("error is: ",error)
                res.status(503).send("problem with addProfile is: " + error+errorArr)
            }
        }
    },

    async signup(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { username = null, password = null, address = null, phoneNumber = null, guards = null } = req.body;
        try {
            const tmp = await Woman.findOne({ phoneNumber });
            if (tmp)
                return res.status(400).json({ msg: "User Already Exists" });

            const user = new Woman({ username, password, address, phoneNumber, guards });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            jwt.sign({ user: { id: user.id } }, "randomString",
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    },

    async login(req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { username = null, phoneNumber = null, password = null } = req.body;
        try {
            let user = await Woman.findOne({ phoneNumber });
            if (!user)
                return res.status(400).json({ message: "User Not Exist" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ message: "Incorrect Password !" });

            jwt.sign({ user: { id: user.id } }, "randomString",
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({ token });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Server Error" });
        }
    },

}