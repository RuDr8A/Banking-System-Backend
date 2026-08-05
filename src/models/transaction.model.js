const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [ true, 'From account is required'],
    index: true,
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [ true, 'To account is required'],
    index : true,   
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'reversed'],
    message: 'Status must be one of pending, completed, failed, or reversed',
    default: 'pending',
  },
    amount: {   
        type: Number,   
        required: [ true, 'Amount is required'],
        min: [ 0, 'Amount must be a positive number'],
    }, 
    idempotencyKey: {  
        type: String,
        required: [ true, 'Idempotency key is required'],
        unique: true,
        index: true
    }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
