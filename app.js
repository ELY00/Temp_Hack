const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

const uri = "mongodb+srv://Hack:hackathon@database.y1m2l.mongodb.net/<dbname>?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    db = client.db("test");
    // perform actions on the collection object
    // client.close();
});

app.listen(process.env.PORT || 5000, () => {
    console.log('listening on 5000')
})

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/signup', (req, res) => {
    res.render("signup");
})

app.get('/login', (req, res) => {
    res.render("login", { x: '' })
})

app.get('/contact', (req, res) => {
    res.render("#");
})

app.get('/about', (req, res) => {
    res.render("#");
})

app.get('/login', (req, res) => {
    if (!user) {
        res.redirect('/login')
        return console.log('Not logged in');
    }
    db.collection(user).find().toArray((err, result) => {
        if (err) return console.log(err)
        // console.log(result)
        res.render("login", {
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

client.close()