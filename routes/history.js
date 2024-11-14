const express = require('express');
const router = express.Router();
const Stack = require('../utils/stack');
const { appendJSON } = require('../utils/fileHandler');
const path = require('path');

// Initialize stack for historical transactions
const transactionStack = new Stack();

// File path for logs
const undoLogsFile = path.join(__dirname, '../data/logs/undoLogs.json');

// GET route to view transaction history
router.get('/view', (req, res) => {
    try {
        const history = [];
        while (!transactionStack.isEmpty()) {
            history.push(transactionStack.pop());
        }
        history.forEach((transaction) => transactionStack.push(transaction)); // Re-push back to the stack

        res.status(200).json({ history });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction history', error });
    }
});

// POST route to undo the most recent transaction
router.post('/undo', async (req, res) => {
    try {
        const lastTransaction = transactionStack.pop();
        if (!lastTransaction || lastTransaction === 'Stack is empty') {
            return res.status(400).json({ message: 'No transactions to undo' });
        }

        // Log the undone transaction
        await appendJSON(undoLogsFile, { ...lastTransaction, undoneAt: new Date().toISOString() });

        res.status(200).json({ message: 'Last transaction undone successfully!', lastTransaction });
    } catch (error) {
        res.status(500).json({ message: 'Error undoing transaction', error });
    }
});

module.exports = router;
