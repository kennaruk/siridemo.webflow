var express = require('express');
var router = express.Router();
var categories = ["Property Tech", "Blockchain Tech", "Robotic Tech"
, "Office Tech", "Food Tech", "Health Tech", "E-Commerce"
, "Transportation & Logistics", "Agriculture Tech", "Insure Tech"];
/* GET home page. */
router.get('/', function(req, res, next) {
  todb.getAllPartners(function(err, partners) {
    partners = partners.sort(function(a,b) {
      return a.name.toLowerCase() > b.name.toLowerCase();
    });
    res.render('backoffice/form_validation.ejs', { partners: partners, categories: categories });
  });
});
router.get('/team/:team', function(req, res, next) {
  var team = req.params.team;
  todb.findTeam(team, function(err, partner) {
    todb.getAllPartners(function(err, partners) {
      partners = partners.sort(function(a,b) {
        return a.name.toLowerCase() > b.name.toLowerCase();
      });
      console.log('partner obj: ', partner);
      res.render('backoffice/form_validation_partner.ejs', { partners: partners, partner: partner, categories: categories });
    });

  });
});
router.post('/team', function(req, res, next) {
  todb.getAllPartners(function(err, partners) {
    partners = partners.sort(function(a,b) {
      return a.name.toLowerCase() > b.name.toLowerCase();
    });
    res.render('backoffice/form_validation.ejs', { partners: partners, categories: categories });
  });
});
router.post('/new-team', function(req, res, next) {
  var obj = req.body;
  obj.intro = JSON.stringify(obj.intro);
  obj.comment = JSON.stringify(obj.comment);
  obj.intro = obj.intro.replace(/\\n/g, " ")
            .replace(/\\'/g, " ")
            .replace(/\\"/g, '')
            .replace(/\\&/g, " ")
            .replace(/\\r/g, " ")
            .replace(/\\t/g, " ")
            .replace(/\\b/g, " ")
            .replace(/\\f/g, " ");
  obj.comment = obj.comment.replace(/\\n/g, " ")
            .replace(/\\'/g, " ")
            .replace(/\\"/g, '')
            .replace(/\\&/g, " ")
            .replace(/\\r/g, " ")
            .replace(/\\t/g, " ")
            .replace(/\\b/g, " ")
            .replace(/\\f/g, " ");
  console.log('obj after replace: ', obj);
  var arr = [];
  arr.push(obj);
  todb.insertPartnership(arr, function(err, partners) {
    todb.getAllPartners(function(err, partners) {
      partners = partners.sort(function(a,b) {
        return a.name.toLowerCase() > b.name.toLowerCase();
      });
      res.render('backoffice/form_validation.ejs', { partners: partners, categories: categories });
    });
  });
});
router.post('/delete-team', function(req, res, next) {
  var id = req.body.id;
  todb.deletePartner(id, function(err, partner) {
    todb.getAllPartners(function(err, partners) {
      partners = partners.sort(function(a,b) {
        return a.name.toLowerCase() > b.name.toLowerCase();
      });
      res.render('backoffice/form_validation.ejs', { partners: partners, categories: categories });
    });
  });
});
router.post('/update-team', function(req, res, next) {
  var name = req.body.name,
  team = req.body.team,
  motto = req.body.motto,
  categorie = req.body.categorie,
  website = req.body.website,
  slide = req.body.slide,
  cover = req.body.cover,
  intro = req.body.intro,
  comment = req.body.comment,
  result = req.body.result;
  console.log('request body: ', req.body);
  var partnerJSON = { name: name,
                      team: team,
                      motto: motto,
                      categorie: categorie,
                      website: website,
                      slide: slide,
                      cover: cover,
                      intro: intro,
                      comment: comment,
                      result: result  }
  partnerJSON.intro = JSON.stringify(partnerJSON.intro);
  partnerJSON.comment = JSON.stringify(partnerJSON.comment);
  partnerJSON.intro = partnerJSON.intro.replace(/\\n/g, " ")
            .replace(/\\'/g, " ")
            .replace(/\\"/g, '')
            .replace(/\\&/g, " ")
            .replace(/\\r/g, " ")
            .replace(/\\t/g, " ")
            .replace(/\\b/g, " ")
            .replace(/\\f/g, " ");
  partnerJSON.comment = partnerJSON.comment.replace(/\\n/g, " ")
            .replace(/\\'/g, " ")
            .replace(/\\"/g, '')
            .replace(/\\&/g, " ")
            .replace(/\\r/g, " ")
            .replace(/\\t/g, " ")
            .replace(/\\b/g, " ")
            .replace(/\\f/g, " ");
  todb.updatePartner(partnerJSON, function(err, partner) {
    var team = partnerJSON.team;
    todb.findTeam(team, function(err, partner) {
      todb.getAllPartners(function(err, partners) {
        partners = partners.sort(function(a,b) {
          return a.name.toLowerCase() > b.name.toLowerCase();
        });
        res.render('backoffice/form_validation_partner.ejs', { partners: partners, partner: partner, categories: categories });
      });
    });
  });
});
module.exports = router;
