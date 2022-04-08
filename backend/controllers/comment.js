const jwt = require("jsonwebtoken");

const db = require('../models/index');
const Op = db.Sequelize.Op;


exports.createComment = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;

  if (req.body.comment === "") {
    return res
      .status(400)
      .json({ error: "Merci de remplir le champ commentaire." });
  }

    db.Comment.create({
    idUsers: userId,
    idMessages: req.params.id,
    comment: req.body.comment,
  })
    .then(() => res.status(200).json({ message: "Commentaire enregistré !" }))
    .catch((error) => res.status(500).json(error));
};

exports.getAllComments = (req, res) => {
  db.Comment.findAll({
    attributes: [
      "id",
      "idUsers",
      "idMessages",
      "comment",
      "createdAt",
      "updatedAt",
    ],
    where: {
      idMessages: req.params.id,
    },
    order: [["updatedAt", "DESC"]],
    include: [
      {
        model: db.User,
        attributes: ["name", "firstname"],
      },
    ],
  })
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteComment = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;
  const isAdmin = decodedToken.isAdmin;

  db.Comment.findOne({
    where: {
      idMessages: req.params.idMessages,
      id: req.params.id,
    },
  }).then((comment) => {
    if (comment.idUsers === userId || isAdmin === true) {
      comment
        .destroy()
        .then(() => {
          res.status(200).json({
            message: "Commentaire supprimé !",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
            message: "Le commentaire n'a pas pu être supprimé",
          });
        });
    }
  });
};
