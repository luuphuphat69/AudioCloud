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
    DateTime:{
        type: String,
        require: true,
    },
});

BillingSchema.methods.accept = function (visitor){
    visitor.calculateDayDiff(this);
}

const Billing = mongoose.model("Billing", BillingSchema, "Billing");
module.exports = Billing;