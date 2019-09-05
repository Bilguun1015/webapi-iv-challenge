const express = require('express');
const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    Users.insert(req.body)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(error => {
            res.status(500).json({error: "Server couldn't process your request"})
        })
});

router.post('/:id/posts',validateUserId, validatePost, (req, res) => {
    const userID = req.params.id;
    req.body.user_id = userID
    Posts.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            res.status(500).json({error: "Server couldn't process your request"});
        });
});

router.get('/', (req, res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json({error: "Server couldn't process your request"});
        })
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const userId = req.params.id
    Users.getUserPosts(userId)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json({error: "Server couldn't process your request"});
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    const userId = req.params.id;
    Users.remove(userId)
        .then(user => {
            res.status(200).json({message: "User successfully deleted"})
        })
        .catch(error => {
            res.status(404).json({error: "Server couldn't delete the user"})
        })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    const userId = req.params.id;
    const changes = req.body;
    Users.update(userId, changes)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(error => {
            res.status(500).json({error: "Server couldn't update the user"})
        })
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    Users.getById(id).then( user => {
        if(user){
            req.user = user;
            next();
        } else {
            res.status(400).json({message: "invalid user id"});
        };
    }).catch(error => {
        res.status(500).json({error: "Server couldn't process your request"})
    });

};

function validateUser(req, res, next) {
    if(JSON.stringify(req.body) !== '{}'){
        if(req.body.name){
            next();
        } else {
            res.status(400).json({message: "missing required name feild"})
        }
    } else {
        res.status(400).json({message: "missing user data"})
    };
};

function validatePost(req, res, next) {
    if(JSON.stringify(req.body) !== '{}'){
        if(req.body.text){
            next();
        } else {
            res.status(400).json({message: "missing required text field"});
        }
    } else {
        res.status(400).json({message: "missing post data"});
    }
};

module.exports = router;
