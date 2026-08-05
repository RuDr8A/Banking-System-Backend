const accountModel = require('../models/account.model');


async function createAccount(req, res) {
    try {
        const user = req.user; // Get the authenticated user from the request
        const  account = await accountModel.create({ user: user._id}); // Create a new account with an initial balance of 0

        res.status(201).json({
            message: "Account created successfully",
            account: {
                _id: account._id,
                user: account.user,
                status: account.status,
                currancy: account.currancy,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt
            },
            status: "Success"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            status: "Failed"
        });
    }
}     

module.exports = { 
    createAccount
}
