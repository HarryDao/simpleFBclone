const Express = require('express');
const Path = require('path');
const BodyParser = require('body-parser');
const Morgan = require('morgan');
const CORS = require('cors');
const PORT = process.env.PORT || 9988;

const app = new Express();

app.use(CORS());
app.use(BodyParser.json({ type: '*/*' }));
app.use(Morgan('dev'));

app.use(Express.static(Path.join(__dirname, './dist')));

// For Heroku setup to combine front-end and back-end
// const routes = require('./functions/express-routes');
// routes(app);


app.get('*', (req, res) => {
    res.sendFile(Path.join(__dirname, './dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});