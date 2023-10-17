const Fav_Controller = require("../controller/fav_controller");
const router = require("express").Router();

router.put('/add-to-fav/:audioId/:userId', Fav_Controller.addAuToFav);
router.get('/get-list-fav/:userId', Fav_Controller.getListFav);
module.exports = router;