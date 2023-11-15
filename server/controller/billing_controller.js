const Billing = require("../model/billing");

const billingController = {
    getBills: async(req, res) => {
        try{
            const bills = await Billing.find();
            return res.status(200).json(bills);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    search: async (req, res) => {
        try {
            const filter = req.query.queries;
            const audio = await Billing.find({
                $or: [
                    { BillId: { $regex: `.*${filter}.*`, $options: 'i' } }, // Case-insensitive search for AudioName
                    { UserId: { $regex: `.*${filter}.*`, $options: 'i' } }, 
                    {DateTime: { $regex: `.*${filter}.*`, $options: 'i' } },
                ],
            }).sort({ Plays: -1 }).limit(100);
    
            res.status(200).json(audio);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },
    createBill: async(req, res) => {
        try{
            const UserId = req.params.userId;
            const bill = new Billing();

            bill.BillId = generateBillId();
            bill.UserId = UserId;
            bill.DateTime = new Date().toLocaleString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });            

            await bill.save();
            return res.status(201).json({message:'Bill Created'});
        }catch(err){
            return res.status(500).json(err);
        }
    },
}
function generateBillId() {
    // Generate an 8-digit random number
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  
    // Concatenate the random number with 'UID' prefix
    const audioId = `BILL${randomNumber}`;
  
    return audioId;
}
module.exports = billingController;