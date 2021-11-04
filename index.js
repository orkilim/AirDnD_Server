const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT /*|| 3031*/;
app.set('port', port);
var cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());

require('./db')

app.use('/', express.static('./public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    
const profilesRouter = require("./routes/profile");
const groupsRouter=require('./routes/group')
    
app.use("/profile", profilesRouter);
app.use("/group",groupsRouter)

app.use(bodyParser.json());


app.listen(port, () => console.log('server listening on port: ', port));