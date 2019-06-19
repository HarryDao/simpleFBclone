const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./express-routes');
const PORT = process.env.PORT || 9999;

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
routes(app);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

