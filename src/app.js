require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
