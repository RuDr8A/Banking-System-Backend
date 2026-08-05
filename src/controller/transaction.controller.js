const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const emailService = require('../services/email.service');
const accountModel = require('../models/account.model');


/**
 * - Create a new transaction and update the ledger accordingly
 * THE 10 STEPS TRANSFER PROCESS
        * 1. Validate the request body to ensure that all required fields are present and valid.
        * 2. Check if the fromAccount and toAccount are the same. If they are, return an error response.
        * 3. Check if a transaction with the same idempotencyKey already exists in the database. If it does, return an error response.
        * 4. Create a new transaction document in the database with the provided details and set its status to 'pending'.
        * 5. Update the ledger for the fromAccount by creating a new ledger entry with type 'debit' and the specified amount.
        * 6. Update the ledger for the toAccount by creating a new ledger entry with type 'credit' and the specified amount.
        * 7. Update the status of the transaction to 'completed' after successfully updating both ledgers.
        * 8. Return a success response with the details of the completed transaction.
        * 9. If any error occurs during the process, catch it and return an error response with an appropriate message.
        * 10. Send a notification or log the transaction details for auditing purposes (optional).
 */

async function createTransaction(req, res) {
    try {
        const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

        // Step 1: Validate the request body
        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        
        // Step 2: Check if fromAccount and toAccount are the same
        const fromAccountExists = await accountModel.findOne({ _id: fromAccount });
        const toAccountExists = await accountModel.findOne({ _id: toAccount });
        
        if (!fromAccountExists || !toAccountExists) {
            return res.status(404).json({ message: 'One or both accounts do not exist' });
        }

        
       

        // Step 3: Check for existing transaction with the same idempotencyKey
        const existingTransaction = await transactionModel.findOne({ idempotencyKey });
        if (existingTransaction) {
            if (existingTransaction.status === 'completed') {
                return res.status(200).json({ message: 'Transaction already completed', transaction: existingTransaction });
            }
            if (existingTransaction.status === 'pending') {
                return res.status(202).json({ message: 'Transaction is still pending', transaction: existingTransaction });
            }
            if (existingTransaction.status === 'failed') {
                return res.status(500).json({ message: 'Previous transaction attempt failed', transaction: existingTransaction });
            }
            if (existingTransaction.status === 'reversed') {
                return res.status(409).json({ message: 'Transaction has been reversed', transaction: existingTransaction });
            }  
        
        }
        if(fromAccount.status === 'inactive' || toAccount.status === 'inactive') {
            return res.status(403).json({ message: 'One or both accounts are inactive' });
        }
        
        // Step 4: Create a new transaction document
        const transaction = new transactionModel({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: 'pending'
        });
        await transaction.save();

        // Step 5: Update the ledger for the fromAccount (debit)
        const debitLedgerEntry = new ledgerModel({
            account: fromAccount,
            transaction: transaction._id,
            amount,
            type: 'debit'
        });
        await debitLedgerEntry.save();

        // Step 6: Update the ledger for the toAccount (credit)
        const creditLedgerEntry = new ledgerModel({
            account: toAccount,
            transaction: transaction._id,
            amount,
            type: 'credit'
        });
        await creditLedgerEntry.save();

        // Step 7: Update the status of the transaction to 'completed'
        transaction.status = 'completed';
        await transaction.save();

        // Step 8: Return a success response
        res.status(201).json({ message: 'Transaction completed successfully', transaction });

        // Step 10: Send a notification or log the transaction details (optional)
        emailService.sendTransactionAlertEmail(fromAccount, toAccount, amount);

    } catch (error) {
        // Step 9: Handle errors
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'An error occurred while processing the transaction', error: error.message });
    }   
}

