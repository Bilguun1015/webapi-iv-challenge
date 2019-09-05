const express = require('express');
const Posts = require('./postDb.js');

const router = express.Router();

router.get('/', (req, res) => {
    Posts.get()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(error => {
            res.status(500).json({error: "Server couldn't process your request"});
        })
});

router.get('/:id', validatePostId, (req, res) => {
    res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
    const postId = req.params.id;
    Posts.remove(postId)
        .then(post => {
            res.status(200).json({message: "Post successfully deleted"})
        })
        .catch(error => {
            res.status(404).json({error: "Server couldn't delete the user"})
        })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
    const postId = req.params.id;
    const changes = req.body;
    Posts.update(postId, changes)
        .then(post => {
            res.status(200).json({changes, messages:"Succesfully updated"})
        })
        .catch(error => {
            res.status(500).json({error: "Server couldn't update the user"})
        })
});

// custom middleware

function validatePostId(req, res, next) {
    const { id } = req.params;
    Posts.getById(id).then( post => {
        if(post){
            req.post = post;
            next();
        } else {
            res.status(400).json({message: "invalid post id"});
        };
    }).catch(error => {
        res.status(500).json({error: "Server couldn't process your request"})
    });
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