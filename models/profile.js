const mongoose = require('mongoose');
//const Guard = require('./guard')
//mongoose.set('useFindAndModify', false);

const schema = {
    name: { type: String, required: true },
    //password: { type: String, required: true },
    address: { type: String, required: false },
    allergies: { type: String,required:true },
    car:{type:String,required:true},
    diet:{type:String,required:true},
    days:{type:[Boolean]}
}


const profile_schema = new mongoose.Schema(schema);
const Profile = mongoose.model('profile', profile_schema);
module.exports = Profile;