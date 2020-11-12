const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    contractAddress: { 
        type: String, 
        required: true, 
        unique: true
    }
});

module.exports = mongoose.model('Contract', contractSchema);