const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')

const MongoClient = require('mongodb').MongoClient

var db

var user = null;


const uri = "mongodb+srv://Hack:test@database.y1m2l.mongodb.net/<dbname>?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err =>
{
    db = client.db("test");

});


app.listen(process.env.PORT || 5000, () => {
    console.log('listening on 5000')
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render("index");
})

app.get('/index', (req, res) => {
    res.render("index");
})

app.get('/signup', (req, res) => {
    res.render("signup");
})

app.get('/faq', (req, res) => {
    res.render("faq");
})

app.get('/account', (req, res) => {
    res.render("account");
})

app.get('/login', (req, res) => {
    res.render("login", { x: '' })
})

app.get('/contact', (req, res) => {
    res.render("index");
})

app.get('/about', (req, res) => {
    res.render("index");
})

app.get('/account', (req, res) => {
    if (!user) {
        res.redirect('/login')
        return console.log('Not logged in');
    }
    db.collection(user).find().toArray((err, result) => {
        if (err) return console.log(err)
        // console.log(result)
        res.render("account", {
            todos: result,
            username: user,
        })
    })
})

app.post('/signup', (req, res) => {
    db.collection('signup').save(req.body, (err, result) => {
        if (err) {
            res.redirect('/signup')
            console.log(err)
        }
        console.log('saved to database')
        res.redirect('/login')
    })
})

    app.post('/logindata', (req, res) => {
        var token = req.body['g-recaptcha-response'];
        var secret_key = '6LfbfswZAAAAAH7Q9WY_1D475Kfdr55WZJArInKA';
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`

        request(url, function (error, response) {
            if (error) {
                console.log(error);
                res.render('Login', { x: 'Error in captcha' });
            }
            console.log(JSON.parse(response.body))
            if (JSON.parse(response.body).success) {
                db.collection('signup').findOne({ username: req.body.username, password: req.body.password }, (err, result) => {
                    if (err) {
                        return console.log(err);
                    }
                    if (!result) {
                        res.render('Login', { x: 'Username or password fault' });
                        res.end();
                        return console.log('Username or password fault');
                    } else {
                        user = req.body.username;
                        console.log(req.body.username + ' was loggedIn successfully!');
                        res.redirect('/account')
                        return res.send()
                    }
                });
            } else {
                res.render('Login', { x: 'Failed captcha' });
                return console.log('Failed captcha');
            }
            // return res.send();
        });

    })

client.close();