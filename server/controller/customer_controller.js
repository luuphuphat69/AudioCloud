const { default: mongoose } = require("mongoose");
const Customer = require("../model/customer");
const jwt = require("jsonwebtoken");
const token = 'token';

const customerController = {

    // Add New Customer 
    addCustomer: async(req, res) => {
        try{
            const newCustomer = new Customer(req.body);
            await newCustomer.save();
            res.status(201).json(newCustomer);
        }catch(error){
            console.error('Error adding customer:', error);
            res.status(500).json({ error: 'Could not add customer' });
        }
    },

    // Customer Login
    customerLogin: async(req, res) => {
        try{
            const { MaKH, MatKhau } = req.body;
            const customer = await Customer.findOne({MaKH});
            if(!customer || customer.MatKhau !== MatKhau){
                return res.status(401).json({message: "Invalid username or password"});
            }
            token = jwt.sign({ userId: customer._id }, process.env.SECRET_KEY, {
                expiresIn: '1h',
            });
            console.log(customer.Email)
            res.json({ token }); // Send the JWT token as a response
        }catch(error){
            console.error(error);
            res.status(500).json({message: "Server error"});
        }
    },

    // Get All Customer
    allCustomer: async(req, res) => {
        try{
            const customers = await Customer.find();
            res.json(customers);
        }catch(error){
            console.error(error);
            res.status(500).json({message: "Server error"});
        }
    },
};

module.exports = customerController;