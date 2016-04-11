
/**
 * Created by andrey on 19.10.15.
 */

var async = require('cloud/node_modules/async.js');

var CompanyHandler = function () {
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

    this.createCompany = function(req, res, next){
        var options = req.body;

        var companyName = options.name;
        var companyLocation = Geo();

        var newCompany = new Company();

        newCompany.set('name', companyName);
        newCompany.set('location', companyLocation);

        newCompany.save({
            success : function(model){
                res.send({success : model});
            },
            error : function(model, error){
                res.send({error : 'error'});
            }
        })
    };

    this.getCompanies = function(req, res, next){
        var query = new Parse.Query(Company);
        query.find({
            success : function(companies){
                res.send(companies);
            },
            error : function(result, error) {
                res.send({error : error.code+' '+error.message});
            }
        });
    };

}

module.exports = CompanyHandler;