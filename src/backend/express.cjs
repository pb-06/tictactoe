const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors())
app.use(express.json())

let matchResults = [];

app.get('/api/results', (req, res) => {
    res.status(200).json(matchResults);
});

app.post('/api/results', (req, res) => {
    const { result } = req.body;

    if (!result) {
        return res.status(400).json({ error: 'A "result" mező hiányzik.' });
    }

    const newMatch = {
        result: result,
        timestamp: new Date().toISOString()
    };

    matchResults.push(newMatch);

    res.status(201).json(newMatch);
});

const port = 3333;
app.listen(port, () => {
    console.log('Express backend server is running on port', port);
});