const mongoose = require('mongoose');
const Profile=require('./profile')
//mongoose.set('useFindAndModify', false);

const schema = {
    group_name: { type: String, required: true },
    //password: { type: String, required: true },
    people:{type:[Profile.schema]}
}


const group_schema = new mongoose.Schema(schema);
const Group = mongoose.model('group', group_schema);
module.exports = Group;
