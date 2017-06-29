var express = require('express');
var router = express.Router();
var session = require('express-session');
router.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.admin)
    return next();
  else
    return res.render('backoffice/login.ejs');;
};
var categories = ["Property Tech", "Blockchain Tech", "Robotic Tech"
, "Office Tech", "Food Tech", "Health Tech", "E-Commerce"
, "Transportation & Logistics", "Agriculture Tech", "Insure Tech"];
router.get('/login', function(req, res, next) {
  res.render('backoffice/login.ejs');
});
router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  todb.findUser(username, function(pwd) {
    console.log('password: ', password,' pwd: ', pwd);
    if(pwd != null) {
      if(password === pwd) {
        req.session.user = username;
        req.session.admin = true;
        todb.getAllPartners(function(err, partners) {
          partners = partners.sort(function(a,b) {
            return a.name.toLowerCase() > b.name.toLowerCase();
          });
          res.render('backoffice/form_validation.ejs', { partners: partners, categories: categories });
        });
      } else {
        console.log('password != pwd');
        res.send('login failed');
      }
    } else {
      console.log('pwd null');
      res.send('login failed');
    }
  });
});
// Logout endpoint
router.get('/logout', function (req, res) {
  req.session.destroy();
  res.render('backoffice/login.ejs');;
});
/* GET home page. */
router.get('/', auth, function(req, res, next) {
  todb.getAllPartners(function(err, partners) {
    partners = partners.sort(function(a,b) {
      return a.name.toLowerCase() > b.name.toLowerCase();
    });
    res.render('backoffice/form_validation.ejs', { partners: partners, categories: categories });
  });
});
router.get('/admin-user', auth, function(req, res, next) {
  todb.getAllPartners(function(err, partners) {
    partners = partners.sort(function(a,b) {
      return a.name.toLowerCase() > b.name.toLowerCase();
    });
    todb.getAllAdmin(function(err, admins) {
      console.log(admins);
      res.render('backoffice/admin-user.ejs', { partners: partners, categories: categories, admins: admins });
    });
  });
});
router.post('/new-admin', auth, function(req, res, next) {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  var obj = {username: username, password: password};
  todb.insertUser(obj, function(err, user) {
    todb.getAllPartners(function(err, partners) {
      partners = partners.sort(function(a,b) {
        return a.name.toLowerCase() > b.name.toLowerCase();
      });
      todb.getAllAdmin(function(err, admins) {
        console.log(admins);
        res.render('backoffice/admin-user.ejs', { partners: partners, categories: categories, admins: admins });
      });
    });
  });
});
router.post('/delete-admin', auth, function(req, res, next) {
  var _id = req.body._id;
  todb.deleteAdmin(_id, function(err, admin) {
    console.log(admin, ' was deleted');
  })
  res.send('delete service success');
});
router.get('/team/:team', auth, function(req, res, next) {
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
router.post('/team', auth, function(req, res, next) {
  todb.getAllPartners(function(err, partners) {
    partners = partners.sort(function(a,b) {
      return a.name.toLowerCase() > b.name.toLowerCase();
    });
    res.render('backoffice/form_validation.ejs', { partners: partners, categories: categories });
  });
});
router.post('/new-team', auth, function(req, res, next) {
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
router.post('/delete-team', auth, function(req, res, next) {
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
router.post('/update-team', auth, function(req, res, next) {
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
