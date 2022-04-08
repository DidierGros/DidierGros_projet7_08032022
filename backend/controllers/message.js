const jwt = require("jsonwebtoken");
const fs = require("fs");

const db = require('../models/index');
const Op = db.Sequelize.Op;


exports.createMessage = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;  

  if (req.body.title === "" || req.body.content === "") {
    return res.status(400).json({ error: "Merci de remplir tous les champs." });
  }

  db.Message.create({
    idUsers: userId,    
    title: req.body.title,
    content: req.body.content,
    image:
      req.body.content && req.file
        ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        : null,
  })
    .then(() => res.status(201).json({ message: "Message enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllMessage = (req, res) => {
    db.Message.findAll({
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
    include: [
      {
        model: db.User,
        attributes: ["name", "firstname"],
      },
    ],
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

exports.getOneMessage = (req, res) => {
  db.Message.findOne({
    attributes: [
      "id",
      "idUsers",
      "title",
      "content",
      "image",      
      "createdAt",
      "updatedAt",
    ],
    where: { id: req.params.id },
  })
    .then((message) => {
      res.status(200).json(message);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.deleteMessage = (req, res) => {  
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;
  const isAdmin = decodedToken.isAdmin;


  db.Message.findOne({
    where: { id: req.params.id },
  })
    .then((message) => {
      if (message.idUsers === userId || isAdmin === true) {
        if (message.image !== null) {
          const filename = message.image.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            message
              .destroy()
              .then(() =>
                res.status(200).json({ message: "Message supprimé !" })
              )
              .catch((error) => res.status(400).json({ error }));
          });
        } else {
          message
            .destroy()
            .then(() => {
              res.status(200).json({
                message: "Message supprimé !",
              });
            })
            .catch((error) => {
              res.status(400).json({
                error: error,
                message: "Le message n'a pas pu être supprimé",
              });
            });
        }
      }
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
