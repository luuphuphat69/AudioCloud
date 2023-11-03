const historyController = require('../controller/history_controller');
const router = require("express").Router();

router.put('/update-history/:audioId/:userId', historyController.updateHistory);
router.get('/get-history/:userId', historyController.getHistory);
module.exports = router;