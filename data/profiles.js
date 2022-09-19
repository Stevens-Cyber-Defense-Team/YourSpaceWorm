const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');

const getProfiles = async () => {
    const profilesCollection = await users();
    const profilesList = await profilesCollection.find({ }, {projection: {_id: 1, name: 1}}).toArray();
    return profilesList.map( elem => ({_id: elem._id.toString(), ...elem}) );
}

const getProfileById = async (userId) => {
    if(!ObjectId.isValid(userId)) { throw 'Error: Invalid id'}
    const usersCollection = await users();
    const profile = await usersCollection.findOne({_id: ObjectId(userId)}, { projection: { password: 0 } });
    if(!profile){
        throw 'User does not exist'
    }
    return { _id: profile._id.toString(), ...profile };
}

function validateTitle(title){
    if(!title) { throw 'Title must exist and not be empty' }
    if(typeof title !== 'string') { throw 'Title must be a string'}
}
function validateContent(content){
    if(!content) { throw 'Content must exist and not be empty' }
    if(typeof content !== 'string') { throw 'Content must be a string'}
}
const addToTimeline = async (userId, title, content)=>{
    if(!ObjectId.isValid(userId)) { throw 'Error: Invalid id'}
    validateTitle(title);
    validateContent(content);

    const usersCollection = await users();
    
    let newMessage = {
        "_id": ObjectId(),
        "title": title,
        "content": content,
    }

    const feedback = await usersCollection.updateOne(
        {_id: ObjectId(userId)},
        { "$push": {"timeline": newMessage} }
    )
    
    if(feedback.modifiedCount === 0){
        throw "no update made"
    }

    return newMessage._id;
}

module.exports = {
    getProfileById,
    getProfiles,
    addToTimeline
}