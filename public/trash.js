/**
 * Created by andrey on 21.10.15.
 */

// create Object


var userId = 'I7DJ0W0VTc';
var user = new Parse.User();

user.set('objectId', userId);
user.fetch({
    success : function(userModel){
        var animalModel = new Parse.Object('Animal');
        var animalACL = new Parse.ACL();
        animalACL.setRoleWriteAccess("Administrator", true);
        animalACL.setRoleWriteAccess("Andrey", true);

        animalModel.set('type', 'dog');
        animalModel.set('name', 'Kiki');
        animalModel.set('isHungry', true);
        animalModel.set('owner', userModel);
        animalModel.setACL(animalACL);


        animalModel.save(null, {
            success : function (){
                res.send({success : 'success'});
            }
        });

    }
});

//---role

var role = new Parse.Role('Administrator');
role.fetch({
    success : function (roleModel){
        var relation = roleModel.relation('users');
        var user = Parse.User();

        user.set('name', 'Andrey');
        user.fetch({success : function (userModel){
            relation.add(userModel);
            role.save({
                success : function (){
                    res.send({success : success})
                }
            })
        }});
    }
});


//---query

var query = Parse.Query(Parse.Object('Animals'));

query.equalTo('value', 1);  //=

query.notEqualTo('value', 2);  // !=

query.limit(10); // defoult 100

query.skip(10); // skip the first 10 results

query.ascending("value"); // sort

query.descending("value"); // sort

query.lessThan("value", 50); // < 50

query.lessThanOrEqualTo("value", 50); //  <= 50

query.greaterThan("value", 50); //  > 50

query.greaterThanOrEqualTo("value", 50); // >= 50

query.containedIn("name", ["Jonathan Walsh", "Dario Wunsch", "Shawn Simon"]);

query.find({
        success : function (result){
            //....
        }
    }
);

//---масиви

query.equalTo("arrayKey", 2);

query.containsAll("arrayKey", [2, 3, 4]);

//---string

query.startsWith("name", "Big Daddy's");

//---реляційні запити


// є створений Parse.Object   myPost
var query = new Parse.Query(Comment);
query.equalTo("post", myPost);
query.find({
    success: function(comments) {
        // comments містить коментарі myPost
    }
});



var Post = Parse.Object.extend("Post");
var Comment = Parse.Object.extend("Comment");
var innerQuery = new Parse.Query(Post);
innerQuery.exists("image");
var query = new Parse.Query(Comment);
query.matchesQuery("post", innerQuery);
query.find({
    success: function(comments) {
        // comments містить всі коментарі для постів з полем "image"
    }
});



var GameScore = Parse.Object.extend("GameScore");
var query = new Parse.Query(GameScore);
query.select("score", "playerName");
query.find()
     .then(function(results) {
    // each of results will only have the selected fields available.
});

query.first().then(function(result) {
    // only the selected fields of the object will now be available here.
    return result.fetch();
}).then(function(result) {
    // all fields of the object will now be available here.
});



