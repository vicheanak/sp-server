'use strict';

var User = require('../models/user');
var jwt  = require('jwt-simple');
var config = require('../config/database');
var uuid = require('uuid');

var functions = {
    authenticate: function(req, res) {
        User.findOne({
            username: req.body.username
        }, function(err, user){
            if (err) throw err;
            if(!user){
                return res.status(403).send({success: false, msg: 'User not found.'});
            } else {
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err) {
                        var token = jwt.encode(uuid.v4(), config.secret);
                        var query = { _id: user._id };
                        User.update(query, { token: token }, function(err, doc){
                            User.findOne({_id: user._id}, function(err, user){
                                var data = {id: user._id, username: user.username, token: user.token};
                                res.json({success: true, token: token, data: data});
                            });
                        });
                    } else {
                        return res.status(403).send({success: false, msg: 'Wrong password.'});
                    }
                })
            }
        })
    },

    addNew: function(req, res){
        if (!req.body.username && !req.body.password){
            res.json({success: false, msg: 'Must enter value'});
        }
        else{
            var newUser = User({
                username: req.body.username,
                password: req.body.password
            });

            newUser.save(function(err, newUser){
                if (err){
                    res.json({success: false, msg: 'Failed to save'});
                }
                else{
                    newUser = {username: newUser.username, token: newUser.token, id: newUser._id};
                    res.json({success: true, data: newUser, msg: 'Successfull saved'});
                }
            })
        }
    },

    isAuth: function(req, res, next){
        var token = req.headers['authorization'];
        User.findOne({token: token}, function(err, user){
            if (err){
                res.json({status: false, msg: 'err'});
            }
            console.log(user);
            if (user){
                 next();
            }
            else{
                res.json({status: false, msg: 'unauth'});
            }
        })
    },

};

module.exports = functions;
