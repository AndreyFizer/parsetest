/**
 * Created by andrey on 19.10.15.
 */

var async = require('cloud/node_modules/async.js');

var ItemsHandler = function () {
    var Animal = Parse.Object.extend('Animals');
    var Company = Parse.Object.extend('Companies');

    function Geo(){
        var lat = Math.random()*80 - 80;
        var long = Math.random()*170 - 170;

        var geoLoc = new Parse.GeoPoint({
            latitude : lat,
            longitude : long
        });

        return geoLoc;
    }

    this.createAnimal = function(req, res, next){
        var options = req.body;
        var userId = req.session.user.objectId;

        var animalType = options.type;
        var animalName = options.name;
        var animalHungry = options.isHungry ? true : false;
        var animalAvatar = options.avatar;
        var animalLoc = Geo();

        var newAnimal = new Parse.Object('Animals');

        newAnimal.set('type', animalType);
        newAnimal.set('name', animalName);
        newAnimal.set('isHungry', animalHungry);
        newAnimal.set('location', animalLoc);

        async.waterfall([

            function(cb){

                var newAvatar = new Parse.File(animalName+'.png', {base64 : animalAvatar});

                console.log('>>>>>>>>>>>>mod1>>>>>>>>>>>> '+animalType + animalName + animalHungry);
                newAvatar.save({
                    success : function(myFile){
                        console.log('>>>>>>>>>>>>mod2>>>>>>>>>>>> '+animalType + animalName + animalHungry);
                        cb(null, myFile);
                    },
                    error   : function(model, error){
                        cb(error)
                    }
                });
                },

            function(myFile, cb){
                var currentUser = new Parse.User();
                currentUser.set("objectId", userId);
                currentUser.fetch({
                    success: function(userModel){
                        cb(null, myFile, userModel);
                    },
                    error : function (error) {
                        cb(error)
                    }
                })
            },

            function(myFile, userModel, cb){
                newAnimal.set('avatar', myFile);
                newAnimal.set('owner', userModel);
                newAnimal.save({
                    success : function(myModel){
                        cb(null, myModel);
                    },
                    error   : function(model, error){
                        cb(error)
                    }
                });
            }

        ],function(error, model){
            if (error){
                //console.log('>>>>>>>>>>>>errrr>>>>>>>>>>>> '+animalType + animalName + animalHungry);
                return res.send({error : 'finish error'});
            }
            //console.log('>>>>>>>>>>>>not>>>>>>>>>>>> '+animalType + animalName + animalHungry);
            res.send(model);
        });


    };

    this.getMyAnimals = function(req, res, next){
        var userId = req.session.user.objectId;

        var userModel = new Parse.User();
        userModel.set('objectId', userId);
        userModel.fetch({
            success : function(model){
                var Animals = Parse.Object.extend('Animals');
                var animalQuery = new Parse.Query(Animals);
                animalQuery.select('type', 'name');
                //animalQuery.equalTo('owner', model);
                animalQuery.find({
                    success : function(collection){
                        res.send(collection);
                    },
                    error : function(model, error){
                        res.send({error : "error"});
                    }
                });
            }
        })
    };

    this.animalAction = function(req, res, next){

        var animalId = req.params.id;

        async.waterfall([
            function(cb){
                var animal = new Animal();
                animal.set('objectId', animalId);
                animal.fetch( {
                    success : function(animalModel){
                        cb(null, animalModel);
                    },
                    error : function(model, error){
                        cb(error);
                    }

                });
            },

            function(animalModel, cb){
                var query = new Parse.Query(Company);
                var animalLoc = animalModel.get('location');
                query.near('location', animalLoc);
                query.first({
                    success : function(model){
                        var clients = model.relation('clients');
                        clients.add(animalModel);
                        cb(null, model);
                    },
                    error : function(model, error){
                        cb(error);
                    }
                });

            }
        ],function(error, model){
            if (error){
                return res.send({error : error})
            }
            model.save({
                success : function(newModel){
                    res.send({success : 'success'})
                },
                error : function(model, error){
                    res.send({error : 'finish error'})
                }
            });
        })
    }
}

module.exports = ItemsHandler;