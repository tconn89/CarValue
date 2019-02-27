const Express = require('express');
const bodyParser = require('body-parser');
const { router: carRouter } = require('./routes/carRouter');

const PORT = process.env.PORT || 3000
const app = Express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/value', carRouter);

app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.get('/test', (req, res) => {
  console.log('Hello World')
  res.send('Sanity Check Passed')
})

app.listen(PORT, function () {
  console.log("Rockin out on port " + PORT + " homie");
});

// 404
app.use(function(req, res, next){
  res.status(404);

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text
  res.type('txt').send('Not found');
});
