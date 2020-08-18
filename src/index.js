const express = require('express');
const app = express();

const path = require('path');

const routes = require('./routes');
const cors = require('cors');

require('./database/authenticate');

app.use(cors());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(express.json());
app.use(routes);


const PORT = 3333;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});