const express = require('express');
const app = express();

const path = require('path');

const mongoose = require('mongoose');

const routes = require('./routes');
const cors = require('cors');


mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://diego_rocha:rocha030604@cluster0.ak5sr.mongodb.net/portfolio?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Conexão com MongoDB feita com sucesso! \n\n`);
}).catch(err => console.log(`Erro ao se conectar ao MongoDB! \n\n`, err));


app.use(cors());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(express.json());
app.use(routes);


const PORT = 3333;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});