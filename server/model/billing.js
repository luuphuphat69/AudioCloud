const mongoose = require("mongoose");

const BillingSchema = new mongoose.Schema({
    BillId:{
        type: String,
        require:true,
    },
    UserId:{
        type: String,
        require: true,
    },
    UserDisplayname: {
        type: String,
        require: true,
    },
    DateTime:{
        type: String,
        require: true,
    },
    Package:{
        type: String,
        require: true
    },
    Pricing:{
        type: String,
        require: true
    }
});
const Billing = mongoose.model("Billing", BillingSchema, "Billing");
module.exports = Billing;