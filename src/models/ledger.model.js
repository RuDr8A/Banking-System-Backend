const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [ true, 'Account is required'],
    index: true,
    immutable: true
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: [ true, 'Transaction is required'],
    index : true,   
  },
  amount: {   
        type: Number,   
        required: [ true, 'Amount is required'],
        min: [ 0, 'Amount must be a positive number'],
        immutable: true
    }, 
  type: {
    type: String,
    enum: ['credit', 'debit'],
    message: 'Type must be either credit or debit',
    required: [ true, 'Type is required'],
    immutable: true
  }
}, { timestamps: true });
function preventLedgerModification() {
  if (this.isModified('account') || this.isModified('transaction') || this.isModified('amount') || this.isModified('type')) {
    return next(new Error('Ledger entries cannot be modified after creation.'));
  }
}
ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre('update', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('findOneAndReplace', preventLedgerModification);

const Ledger = mongoose.model('Ledger', ledgerSchema);

module.exports = Ledger;        