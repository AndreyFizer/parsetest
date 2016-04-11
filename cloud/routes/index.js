/**
 * Created by andrey on 19.10.15.
 */

var express = require('express');
var UserHandler = require('cloud/handlers/users');
var AnimalsHandler = require('cloud/handlers/animals');
var CompaniesHandler = require('cloud/handlers/companies');

module.exports = function (app) {
    var users = new UserHandler();
    var items = new AnimalsHandler();
    var companies = new CompaniesHandler();

    app.get('/temp/first', function(req, res, next){

        if (req.session && req.session.user) {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> '+ req.session);
            res.render('hello.ejs', {message: req.session.user.username});
        } else {
            res.render('login.ejs', {a: 1});
        }
    });

    app.get('/temp/registr', function(req, res, next){
        res.render('registration.ejs', {a: 1});
    });

    app.get('/temp/animalItem', function(req, res, next){
        res.render('animals.ejs', {a: 1});
    });

    app.get('/test', users.test);

    app.post('/signUp', users.signUp);
    app.post('/signIn', users.signIn);
    app.post('/signOut', users.signOut);
    app.post('/users', users.saveUser);
    app.get('/users', users.getUsers);
    app.get('/users/:id', users.getUserById);
    app.post('/animal', items.createAnimal);
    app.get('/animal/:id', items.animalAction);
    app.get('/animals', items.getMyAnimals);
    app.post('/company', companies.createCompany);


    function testMiddleware (req, res, next) {
        req.query.myNewParam = Parse.Config.PARAMETR_1;
        next();
    }

    //app.get('/test', testMiddleware, function(req, res, next) {
    //    //var curUser =
    //
    //    res.status(200).send({
    //        success : "OK",
    //        query   : req.query,
    //        cookies : req.cookies,
    //        session : req.session
    //    });
    //});

    //app.use('/users', usersRouter);
};