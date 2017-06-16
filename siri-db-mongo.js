exports.initDatabase = function(mongoose, callback) {
  partnership = mongoose.model('partnership', new mongoose.Schema({
    name: { type: String, trim: true },
    team: { type: String, trim: true },
    motto: { type: String, trim: true },
    categorie: { type: String, trim: true },
    website: { type: String, trim: true },
    slide: { type: String, trim: true },
    cover: { type: String, trim: true },
    intro: { type: String, trim: true },
    comment: { type: String, trim: true },
    result: { type: String, trim: true },
    partnership: { type: Boolean, default: false },
    featured: { type: Boolean, default: false }
    })
  );
  exports.reFetchDatabaseFromJSON = function() {
    partnership.remove({}).exec(function (err, partners) { //NOTE: Remove all in database and fetch new on json file
      if(err)
        console.log('remove collection in mongodb err.');
      else {
        //NOTE: Sync File From JSON DUMMY Database
        var fs = require('fs');
        var partnerArray = JSON.parse( fs.readFileSync('partners.json', 'utf8') );
        console.log(partnerArray);
        partnership.insertMany(partnerArray, function(err, partners) {
          if(!err)
            console.log('refetch succeed');
          else {
            console.log('refetch err');
          }
        });
      }
    });
  }

  exports.insertPartnership = function(obj, callback) {
    partnership.insertMany(obj, function(err, partners) {
      callback(err, partners);
    });
  }
  exports.getAllPartners = function(callback) {
    partnership.find(function(err, partners) {
      callback(err, partners);
    });
  }
  exports.getPropertyTechs = function(callback) {
    partnership.find({categorie: "Property Tech"}, function(err, partners) {
      callback(err, partners);
    });
  }
  exports.getPartnersObj = function(callback) {
    var categories = ["Property Tech", "Blockchain Tech", "Robotic Tech"
    , "Office Tech", "Food Tech", "Health Tech", "E-Commerce"
    , "Transportation & Logistics", "Agriculture Tech", "Insure Tech"];
    var objs = { 'featured': [] };
    var categoriesLoop = function(objs, i, bound, callback) {
      if(i >= bound) {
        callback(objs);
        return;
      }
      partnership.find({categorie: categories[i]}, function(err, partners) {
        if(!err) {
          objs[categories[i]] = partners;
          for(var cnt = 0 ; cnt < partners.length ; cnt++) {
            if(partners[cnt].featured == true)
              objs['featured'].push(partners[cnt]);
          }
        } else {
          console.log(err);
        }
        categoriesLoop(objs, i+1, bound, callback);
      });
    }
    categoriesLoop(objs, 0, categories.length, callback);
  }
  exports.findTeam = function(team, callback) {
    partnership.findOne({team: team}, function(err, partner) {
      if(!err) {
        callback(err, partner);
      } else {
        console.log(err);
      }
    });
  }
}
