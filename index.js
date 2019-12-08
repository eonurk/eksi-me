const express = require('express');
const bodyParser = require('body-parser');
const eksi = require('./eksi.js');
const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.set('port', (process.env.PORT || 5000))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));
app.get('/', function(request, response) {
    response.render('index.html')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at http://localhost:" + app.get('port'))
})

app.get('/check', function(req, res) {
    console.log('path params:', req.params);
    console.log('query params:', req.query);
    console.log('body:', req.body);
    const { q } = req.query;
    if (!q || !q.length) {
        return res.json({
            error: 'doldurmamız lazım ama buraları...',
        });
    }
    eksi.parseEksi(req.query.q)
        .then((data) => {
            res.json(data);
        })
        .catch((...e) => {
            console.error('Failed to get data', ...e);
            res.json({ error: 'olmadı ya, bi şeyler ters gitti :('})
        })
});
