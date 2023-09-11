const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    MaKH:{
        type: String,
        require:true
    },
    MaLoaiKH:{
        type: String,
        require: true,
    },
    Ho:{
        type: String,
        require:true
    },
    Ten:{
        type: String,
        require: true
    },
    Email:{
        type: String,
        require: false
    },
    DiaChi:{
        type:String,
        require: false
    },
    MatKhau:{
        type: String,
        require:true
    }
});

const Customer = mongoose.model("KhachHang", customerSchema, "KhachHang");
module.exports = Customer;