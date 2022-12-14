const express = require('express');
const router = express.Router();
const data = require('../data');
const users = data.users;
const profiles = data.profiles;

router.route('/').get((req,res) => {
    res.redirect('/login')
})

router.route('/signup')
.get(async (req, res) => {

    // serve signup page
    try{
        res.render('signup')
    }catch(e){
        //render error alert or page or something
        console.error(e);

    }
})
.post( async (req, res) => {
    // backend call to sign up user
    /*
        Expected body:
            username *will be forced to be unique*
            password
            name
    */
    try{
        const username = req.body.username;
        const password = req.body.password;
        const name = req.body.name;
        const info = await users.createUser(username, password, name);
        res.redirect('./login');
        //we can send them to the login page now

    }catch(e){
        console.error(e);
        res.status(400).json({'status': 400, 'message': 'error creating account', 'e': e});
    }
});
router.route('/login')
.get(async (req, res) => {
    // serve login page
    try{
        res.render('login')
    }catch(e){
        //render error alert or page or something
    }
})
.post( async (req, res) => {
    // backend call to log in user
    try{
        const username = req.body.username;
        const password = req.body.password;
        let result = await users.checkUser(username, password);
        if(result.authenticated == true){
            req.session.username = username;
            req.session.userId = result.userId;
            // res.redirect('../private');
            // TODO anywhere we want to go after we log in
            // maybe our profile or something
            res.redirect('/profiles')
        }else{
            res.status(500).json({'status': 500, 'message': 'something went wrong', 'e': e});
        }

    }catch(e){
        console.error(e);
        res.render('login', {error: e});
    }
});
router.route('/logout')
.get(async (req,res) =>{
    try{
        req.session.destroy();
        res.redirect('/login')

        // res.render('loggedout', {title: "Log Out Screen", message: "Successfully logged out"})   
    }catch(e){
        console.error(e);

        res.status(500).json({'status': 400, 'message': 'something went wrong', 'e': e});
    }
    
});

router.route('/profiles/:id')
.get(async (req, res) => {
    // get profile by id
    try{
        let postAccess = false;
        const id = req.params.id;
        const profile = await profiles.getProfileById(id);
        if(profile.username == req.session.username) {
            postAccess = true;
        }
        res.render('profiles/show', {profile: profile, postAccess: postAccess});
    }catch(e){
        //render error alert or page or something
        console.error(e);
        res.status(400).json({'status': 500, 'message': 'something went wrong', 'e': e});
    }
});

router.route('/profiles')
.get(async (req, res) => {
    // get all profiles
    try{
        const profileList = await profiles.getProfiles();
        const profile = await profiles.getProfileById(req.session.userId);
        res.render('profiles/showAll', {profile: profile, profiles: profileList});
        //render something
    }catch(e){
        //render error alert or page or something
        console.log(e);
        res.redirect('/login');
    }
});

router.route('/createPost')
.post(async (req, res) => {
    try{
        const title = req.body.title;
        const content = req.body.content;
        const info = await profiles.addToTimeline(req.session.userId, title, content);
        res.status(200).json({'status': 200, info}); 
    }catch(e){
        console.error(e);
        res.status(400).json({'status': 500, 'message': 'something went wrong', 'e': e});

    }
})

module.exports= router;