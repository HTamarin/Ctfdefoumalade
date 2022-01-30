var express = require("express");
var router = express.Router();
var sha1 = require('sha1');


const mysql = require("mysql");
const con = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root",
  database: "ctf",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connecté à la base de données MySQL!");

  // login user
  router.post("/login", (req, res) => {
    con.query(
      `SELECT * FROM utilisateur WHERE username='${req.body.email}' AND motdepasse='${sha1(req.body.password)}'`,
      function (err, result) {
        if (err) throw err;
        if (result.length != 0) {
          // // AJOUTER LA VERIF DU PASS PAR RAPPORT AU HASH
          // hash = bcrypt.hashSync(req.body.password, salt);
          // if (
          //   bcrypt.compareSync(
          //     `${req.body.password}`,
          //     `${result[0].motdepasse}`
          //   )
          // ) {
          req.session.user = req.body.email;
          res.redirect("/route/dashboard");
          // } else {
          //   req.session.error = `Votre nom d'utilisateur ou votre mot de passe est incorrect`;
          //   res.redirect("/");
          // }
        } else {
          req.session.error = `Votre nom d'utilisateur ou votre mot de passe est incorrect`;
          res.redirect("/");
        }
      }
    );
  });

  router.get("/register", (req, res) => {
    if (req.query.status) {
      res.locals.error = "Un compte avec cet email existe déjà";
    }
    res.render("register", { title: "Register System" });
  });

  router.post("/register", (req, res) => {
    var sql = `SELECT * from utilisateur WHERE username = '${req.body.email}'`;
    con.query(sql, function (err, result) {
      if (result.length != 0) {
        req.session.error = "Un compte avec cet email existe déjà";
        res.redirect("/route/register?status=exist");
      } else {
        // var hash = bcrypt.hashSync(`${req.body.password}`, salt);
        if (req.body.email && req.body.password) {
          var sql = `INSERT INTO utilisateur (username, motdepasse, role) VALUES ('${req.body.email}', '${sha1(req.body.password)}','superadmin')`;
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
           // req.session.validate =
           //   "Votre compte a bien été créé ! Key: jesuislepremierflag ";
            res.redirect("/");
          });
        } else {
          req.session.error = "Email ou mot de passe incorrect";
          res.redirect("/route/register?status=error");
        }
      }
    });
  });

  // route for dashboard
  router.get("/dashboard", (req, res) => {
    if (req.session.user) {
      if(req.session.user=="ctf@ctf.fr"){res.locals.key='Dernière clé ! Bien joué ! Key:Y0uH4v8C0mPl8t84ll'}
      res.render("dashboard", {
        title: "Dashboard",
        logout: "déconnexion réussie...!",
      });
    } else {
      res.render("404");
    }
  });

  router.get("/challenge", (req, res) => {
    if (req.session.user) {
      if(req.session.getmessage){
        res.locals.getmessage = req.session.getmessage
      }
      res.render("challenge", {
        title: "Challenge",
        logout: "déconnexion réussie...!", 
      });
    } else {
      res.render("404");
    }
  });

  router.post("/challenge", (req, res) => {
    if (req.session.user) {
      console.log(req.body);
      if (req.body.score > 99999){
        getmessage = `Bien joué ! Votre score est de ${req.body.score} ! Vous m'avez battu, voici le deuxième flag : Key:AmaTh8Sec0ndk8y`
      } else{
        getmessage = `Vous avez perdu ! Votre score est de ${req.body.score} , réessayez`
      }
      res.render("challenge", {
        title: "Challenge",
        getmessage: getmessage, 
      });
    } else {
      res.render("404");
    }
  });


  router.get("/page", (req, res) => {
      res.render("recherche", {
        logout: "déconnexion réussie...!",
      });
  });

  router.post("/recherche", (req, res) => {
    console.log(req.body.recherche)
    var sql = `SELECT id,username FROM utilisateur WHERE id='${req.body.recherche}'`;
    console.log(sql)
          con.query(sql, function (err, result) {

            if(result==undefined ){
              res.render("recherche", {
              logout: "déconnexion réussie...!",
              result: "invalid input"
            });
          }else if(result.length == 0){
            res.render("recherche", {
              logout: "déconnexion réussie...!",
              result: "Aucun resultat"
            });
          }else{
              res.render("recherche", {
                logout: "déconnexion réussie...!",
                result: JSON.stringify(result)
              });
            }
          });
  });

  // route for logout
  router.get("/logout", (req, res) => {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        res.send("Error");
      } else {
        res.render("base", {
          title: "Express",
          logout: "déconnexion réussie...!",
        });
      }
    });
  });
});
module.exports = router;
