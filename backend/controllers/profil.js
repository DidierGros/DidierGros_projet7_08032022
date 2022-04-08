const jwt = require("jsonwebtoken");

const db = require('../models/index');
const Op = db.Sequelize.Op;


exports.getOneProfil = (req, res) => {
  db.User.findOne({
    attributes: ["id", "email", "name", "firstname", "isAdmin"],
    where: { id: req.params.id },
  })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
        message: "Utilisateur non trouvé !",
      });
    });
};

exports.modifyProfil = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;
  const isAdmin = decodedToken.isAdmin;

  if (req.body.name == "" || req.body.firstname == "") {
    return res
      .status(400)
      .json({ error: "Merci de remplir tous les champs !" });
  }

  db.User.findOne({
    where: { id: req.params.id },
  }).then((user) => {
    if (user.id === userId || isAdmin === true) {
      user
        .update({
          name: req.body.name,
          firstname: req.body.firstname,
        })
        .then(() => res.status(200).json({ message: "Profile modifié !" }))
        .catch((error) =>
          res
            .status(400)
            .json({ error: "Impossible de mettre à jour votre profile !" })
        );
    }
  });
};

exports.getAllMessagesProfil = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;

  models.Message.findAll({
    order: [["updatedAt", "DESC"]],
    attributes: [
      "id",
      "idUsers",
      "title",
      "content",
      "image",
      "createdAt",
      "updatedAt",
    ],
    where: { idUsers: userId },
  })
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteProfil = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;
  const isAdmin = decodedToken.isAdmin;

  db.User.findOne({
    where: { id: req.params.id },
  })
    .then((user) => {
      if (user.id === userId || isAdmin === true) {
        user
          .destroy()
          .then(() => {res.status(200).json({message: "Utilisateur supprimé !",});
          })
          .catch((error) => {res.status(400).json({error: "L'utilisateur n'a pas pu être supprimé !",});
          });
      }
    })
    .catch((error) => {
      res.status(400).json({ error: "L'utilisateur n'a pas pu être supprimé !",});
    });
};
