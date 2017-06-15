var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var categories = ["Property Tech", "Blockchain Tech", "Robotic Tech"
  , "Office Tech", "Food Tech", "Health Tech", "E-Commerce"
  , "Transportation & Logistics", "Agriculture Tech", "Insure Tech"];
  todb.getPartnersObj(function(objs) {
      var allPartners = [];
      for(var i = 0 ; i < categories.length ; i++) {
        for(var j = 0 ; j < objs[categories[i]].length ; j++) {
          allPartners.push(objs[categories[i]][j]);
        }
      }
      allPartners = allPartners.sort(function(a,b) {
        return a.name.toLowerCase() > b.name.toLowerCase();
      });
      res.render('index.ejs', { partners: objs, categories: categories, allPartners: allPartners });
  });
});
router.get('/team/:team', function(req, res, next) {
  var team = req.params.team;
  todb.findTeam(team, function(err, partner) {
    var dummy = {
      "name": "Apartmentary",
      "motto": "ระบบจัดการอพาร์ทเม้นท์ หอพัก ใช้งานฟรี",
      "team": "xx",
      "categories": "Property Tech",
      "website": "https://apartmentery.com",
      "slide": "https://drive.google.com/open?id=0B5cXDg47WUAjTUxVZ3dVelpmWkk",
      "cover": "http://mixliveent.com/wp-content/uploads/2017/01/beautiful-apartment-17-as-inspiration.jpg",
      "intro": "Apartment intro",
      "comment": "Apartment comment",
      "result": "Apartment result",
      partnership: true,
      featured: true
    }; //TODO: change to use partner instead of dummy
    res.render('detail_team.ejs', { partner: dummy });
  })
});
module.exports = router;
