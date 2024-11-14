const express = require('express');
// const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/payments');
const historyRoutes = require('./routes/history');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the Public Utility Bill Payment System!');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/payments', paymentRoutes);
app.use('/history', historyRoutes);

// Ensure necessary directories exist
const dataDir = path.join(__dirname, 'data');
const logsDir = path.join(dataDir, 'logs');
const invoicesDir = path.join(__dirname, 'invoices');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'An unexpected error occurred!', error: err.message });
});



// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
