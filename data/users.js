const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require ('bcrypt');
const { ObjectId } = require('mongodb');
const SALT_ROUNDS = 10;

const validateUsername = (username) =>{
    if(!username) { throw 'Username must exist and not be empty' }
    if(typeof username !== 'string') { throw 'Username must be a string'}
}
const validatePassword = (password) =>{
    if(!password) { throw 'Password must exist and not be empty' }
    if(typeof password !== 'string') { throw 'Password must be a string'}
}
const validateName = (name) =>{
    if(!name) { throw 'Name must exist and not be empty' }
    if(typeof name !== 'string') { throw 'Name must be a string'}
}


const createUser = async (username, password, name) => {
    validateUsername(username);
    validatePassword(password);
    validateName(name);
    const usersCollection = await users();
    usersCollection.createIndex({"username": 1}, { unique: true });
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    let newUser = {
        _id: ObjectId(),
        username: username.toLowerCase(),
        password: hashedPassword,
        name: name,
        timeline: []
    }
    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId){
        throw 'Error: Could not add User';
      }
    
    return {userInserted: true, userId: newUser._id.toString()}
}

const checkUser = async (username, password) =>{
    validateUsername(username);
    validatePassword(password);

    const usersCollection = await users();
    const account = await usersCollection.findOne({username: username.toLowerCase()});
    if (account === null) throw 'Either the username or password is invalid';

    let match = await bcrypt.compare(password, account.password);
    if(match){
        return {authenticated: true, userId: account._id.toString()}
    }else{
        throw 'Either the username or password is invalid'
    }
}

module.exports= {
    createUser,
    checkUser
};