const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve the transcripts folder
app.use('/transcripts', express.static(path.join(__dirname, 'transcripts')));

app.get('/', (req, res) => {
    res.send('🚀 Bot is running! Access transcripts via /transcripts/<file_name>');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
