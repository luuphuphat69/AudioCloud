const Fav_Controller = require("../controller/fav_controller");
const router = require("express").Router();

router.put('/add-to-fav/:audioId/:userId', Fav_Controller.addAuToFav);

module.exports = router;