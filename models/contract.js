const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    contractAddress: { 
        type: String, 
        required: true, 
        unique: true
    },
    tokenSymbol: {
        type: String,
        required: true,
        unique: true
    },
    tokenName: {
        type: String,
        required: true
    },
    decimals: {
        type: Number,
        default: 18
    }
}, {versionKey: false});

module.exports = mongoose.model('Contract', contractSchema);