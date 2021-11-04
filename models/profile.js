const mongoose = require('mongoose');
const Group = require('./group')
//mongoose.set('useFindAndModify', false);

const schema = {
    name: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: false,default:"israel" },
    allergies: { type: String,required:true,default:"none" },
    car:{type:String,required:true,default:"don't own"},
    diet:{type:String,required:true,default:"omnivore"},
    days:{type:[Boolean],required:true,default:[false,false,false,false,false,true,true]},
    groups:{type:[String],required:true,default:[]}
}


const profile_schema = new mongoose.Schema(schema);
const Profile = mongoose.model('profile', profile_schema);
module.exports = Profile;