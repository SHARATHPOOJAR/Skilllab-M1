const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

// Routes
const paymentRoutes = require('./routes/payments');
const historyRoutes = require('./routes/history');

app.use('/payments', paymentRoutes);
app.use('/history', historyRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
