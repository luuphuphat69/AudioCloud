const billingController = require('../controller/billing_controller');
const router = require("express").Router();

router.get('/get-bills', billingController.getBills);
router.post('/create-bill/:userId', billingController.createBill);
router.get('/search', billingController.search);
router.get('/bill-datediff', billingController.dateDiff);
module.exports = router;