const express = require("express");
const router = express.Router();
const profileCtrl = require("../controllers/profil");
const auth = require("../Middleware/auth");

router.get("/profile/:id", auth, profileCtrl.getOneProfil);
router.get("/profile/:id/messages", auth, profileCtrl.getAllMessagesProfil);
router.put("/profile/:id", auth, profileCtrl.modifyProfil);
router.delete("/profile/:id", auth, profileCtrl.deleteProfil);

module.exports = router;
