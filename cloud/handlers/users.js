/**
 * Created by andrey on 19.10.15.
 */

var async = require('cloud/node_modules/async.js');
var constants = require('cloud/constants/constants.js');

var UsersHandler = function () {

    //this.test = function (req, res) {
    //    var like1 = new Parse.Object.('Likes');
    //    var like2 = new Parse.Object.('Likes');
    //    like1.set('l','l1');
    //    like2.set('l','l2');
    //    like1.save();
    //    like2.save();
    //    var query = Parse.Query(Parse.User());
    //    query.first({success : function(user) {
    //        var relation = user.relation("likes");
    //        relation.add(like1);
    //        relation.add(like2);
    //        user.save(null,{
    //            success : function(){
    //                res.send({success: success})
    //            }
    //        });
    //    }})

    this.test = function(req, res, next){
        var role = new Parse.Role();

        async.waterfall([
            function(cb){
                var currentUser = new Parse.User();
                currentUser.set('objectId', 'rjK4S267Ae');
                currentUser.fetch({
                    success : function(model){
                        console.log('>>>>>>>>>>>>>>>>>. error 0');
                        cb(null, model);
                    },
                    error : function(model, error){
                        cb(error);
                    }
                });
            },

            function(model, cb){

                role.set('objectId','NpU4GRNoWS');
                role.fetch({
                    success : function(myRole){
                        var roleUsers = myRole.relation('users');
                        roleUsers.add(model);
                        console.log('>>>>>>>>>>>>>>>>>. error 1');
                        cb(null ,myRole);
                    },
                    error : function(model, error){
                        console.log('>>>>>>>>>>>>>>>>>. error 2');
                        cb(error);
                    }
                })}

            //function(cb){
            //    var currentUser = new Parse.Role();
            //    currentUser.set('objectId', 'DOBMQzduDM');
            //    currentUser.fetch({
            //        success : function(modelA){
            //            console.log('>>>>>>>>>>>>>>>>>. error 0');
            //            cb(null, modelA);
            //        },
            //        error : function(model, error){
            //            cb(error);
            //        }
            //    });
            //},
            //
            //function(model, cb){
            //
            //    role.set('objectId','NpU4GRNoWS');
            //    role.fetch({
            //        success : function(myRole){
            //            var roleUsers = myRole.get('roles');
            //            roleUsers.add(model);
            //            console.log('>>>>>>>>>>>>>>>>>. error 1');
            //            cb(null ,myRole);
            //        },
            //        error : function(model, error){
            //            console.log('>>>>>>>>>>>>>>>>>. error 2');
            //            cb(error);
            //        }
            //    });
            //}
        ],function(error, model){
            if (error){
                res.send({error : "error"});
            }
            model.save({
                success : function(newRole){
                    res.send(newRole);
                },
                error : function(model, error){
                    res.send({error : "another error"});
                }
            });
        });


    };



    this.signUp = function (req, res, next) {
        var user = new Parse.User();
        var options = req.body;
        var name = options.username;
        var pass = options.password;
        var mail = options.email;
        var role = +options.role ? 'Viewer' : 'Administrator';
        var tytle = 'some title';

        //var currentUser = new Parse.ACL();
        //currentUser.setPublicReadAccess(false);
        //currentUser.setPublicWriteAccess(false);
        //currentUser.setRoleReadAccess(role, true);

        user.set("username", name);
        user.set("password", pass);
        user.set("email", mail);
        user.set("tytle", tytle);
        //user.setACL(currentUser);
        console.log('----------------------------> mb11');

        user.signUp(null, {
            success: function (user) {
                console.log('----------------------------> mb2');
                var roleRelation = new Parse.Role();
                roleRelation.get('NpU4GRNoWS',{
                    success : function(curRole){
                        var curRelation = curRole.relation('users');
                        curRelation.add(user);
                        curRole.save({
                            success : function(){
                                res.send({success : user.get('username')});
                            },
                            error : function(){
                                res.send({error : 'on finish'})
                            }
                        });
                    },
                    error : function(){
                        res.send({error: 'error'});
                    }
                });
                //res.render('hello.ejs', {message : user.get('username')});
            },
            error: function (user, error) {
                res.send({error: error});
            }
        });
    };

    this.signIn = function (req, res) {
        var options = req.body;
        var name = options.username;
        var pass = options.password;

        Parse.User.logIn(name, pass, {
            success: function (user) {
                var currentUser = Parse.User.current();

                req.session.user = currentUser;
                //res.send(user);
                res.render('hello.ejs', {message : currentUser.get('username')});
            },
            error: function (user, error) {
                res.send({error: error});
            }
        });
    };

    this.signOut = function (req, res) {

        Parse.User.logOut();
        var test = Parse.User.current();

        req.session = null;
        res.send({action : test});
    };

    this.getUsers = function (req, res, next) {
        var query = new Parse.Query(Parse.User);

        query.find({
            success: function (result) {
                res.send(result);
            }
        });
    };

    this.getUserById = function (req, res) {
        var userId = req.params.id;
        var query = new Parse.Query(Parse.User);

        query.equalTo("objectId", userId);
        query.first({
            success: function (result) {
                res.render('userItem.ejs', result.toJSON());
            }
        });
    };

    this.saveUser = function (req, res, next) {
        var options = req.body;
        var id = options.objectId;
        var name = options.username;
        var tytl = options.tytle;
        console.log('>>>>>>>>>>>>>>>>... '+id);

        var query = new Parse.Query(Parse.User);

        query.equalTo("objectId", id);
        query.first({
            success: function (result) {
                console.log('>>>>>>>>>>>>>>>>. '+result);
                result.set('username', name);
                result.set('tytle', tytl);
                result.save(null,{
                    success: function(model){
                        res.send(model);
                    },
                    error : function(user, error){
                        alert(error.message);
                    }
                });
            }
        });
    };
};

module.exports = UsersHandler;