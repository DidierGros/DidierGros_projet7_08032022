const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const passwordValidator = require('password-validator');

const db = require('../models/index');
const Op = db.Sequelize.Op;

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const passwordSchema = new passwordValidator()

passwordSchema
.is().min(8)                                    
.is().max(20)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits(2)                                
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123', 'motdepasse']); 

exports.signup = (req, res) => {
  if (req.body.name == null || req.body.firstname == null || req.body.email == null || req.body.password == null) {
    return res
      .status(400)
      .json({ error: "Merci de remplir tous les champs !" });
  }
  if (!EMAIL_REGEX.test(req.body.email)) {
    return res.status(400).json({ error: "Email incorrect !" });
  }
  if (!passwordSchema.validate(req.body.password)) {
    return res.status(401).json({
      error: "'Votre mot de passe doit comporter au moins 8 caractères, des majuscules, des minuscules et des chiffres",});
  }

  db.User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {

            const user = db.User.build({

            email: req.body.email,
            name: req.body.name,
            firstname: req.body.firstname,
            password: hash,            
            isAdmin: false      
    
            })
            user.save()           
              .then((user) => {
                res.status(201).json({
                  userId: user.id,
                  isAdmin: user.isAdmin,
                  message: "Utilisateur créé !"
                });
              })
              .catch((error) => res.status(400).json({ error: error }));
          })
      } else {
        return res.status(409).json({ error: "Cet utilisateur existe déjà !" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  if (req.body.email == null || req.body.password == null) {
    return res
      .status(400)
      .json({ error: "Merci de remplir tous les champs !" });
  }

  db.User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur introuvable !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user.id,
            name: user.name,
            firstname: user.firstname,
            isAdmin: user.isAdmin,
            token: jwt.sign(
              { userId: user.id, isAdmin: user.isAdmin},
              "RANDOM_TOKEN_SECRET",
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
