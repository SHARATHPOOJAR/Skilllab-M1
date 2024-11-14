const express = require('express');
const router = express.Router();
const { Queue, PriorityQueue } = require('../utils/queue');
const Stack = require('../utils/stack');
const { writeJSON, appendJSON, writeCSV } = require('../utils/fileHandler');
const path = require('path');

// Initialize queues and stack
const paymentQueue = new Queue();
const priorityQueue = new PriorityQueue();
const transactionStack = new Stack();

// File paths
const transactionsFile = path.join(__dirname, '../data/transactions.json');
const dailyLogsFile = path.join(__dirname, '../data/logs/dailyLogs.json');
const invoiceDir = path.join(__dirname, '../invoices/');

// POST route to add a new payment request
router.post('/add', async (req, res) => {
    console.log('Request received:', req.body); // Debugging

    const { type, amount, priority, details } = req.body;

    try {
        if (priority) {
            priorityQueue.enqueue({ type, amount, details }, priority);
        } else {
            paymentQueue.enqueue({ type, amount, details });
        }
        res.status(200).json({ message: 'Payment request added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding payment request', error });
    }
});


// POST route to process a payment request
router.post('/process', async (req, res) => {
    try {
        let payment = priorityQueue.isEmpty()
            ? paymentQueue.dequeue()
            : priorityQueue.dequeue();

        if (!payment || payment === 'Queue is empty') {
            return res.status(400).json({ message: 'No payment requests to process' });
        }

        // Generate invoice and store transaction
        const timestamp = new Date().toISOString();
        const transaction = { ...payment, timestamp };
        transactionStack.push(transaction);
        await appendJSON(transactionsFile, transaction);

        // Save invoice (CSV format)
        const invoicePath = path.join(invoiceDir, `invoice_${timestamp}.csv`);
        await writeCSV(invoicePath, [transaction]);

        // Log transaction
        await appendJSON(dailyLogsFile, transaction);

        res.status(200).json({ message: 'Payment processed successfully!', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment', error });
    }
});

// GET route to view the next payment request
router.get('/next', (req, res) => {
    const nextPayment = priorityQueue.isEmpty()
        ? paymentQueue.front()
        : priorityQueue.front();

    if (!nextPayment || nextPayment === 'Queue is empty') {
        return res.status(400).json({ message: 'No payment requests in the queue' });
    }
    res.status(200).json({ nextPayment });
});

module.exports = router;
