const path = require('path')
const express = require('express')
const app = express()
const fs = require('fs')

var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static('/public'))
app.all('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'))
})
app.all('/input.html', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/input.html'))
})
app.all('/logic.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/logic.js'))
})
app.all('/assets/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/assets/style.css'))
})
app.get('/api/input', (req, res) => {
    res.sendFile(path.join(__dirname, "/db.json"))
})

app.post('/api/input', (req, res) => {
    var houseInput = req.body;
    console.log(houseInput)
    houseInput.routeName = houseInput.Address.replace(/\s+/g, "").toLowerCase();
    houseInput.purchasePrice = Math.floor((houseInput.resalePrice - (houseInput.resalePrice * 0.12)
        - (0.0068 * -(houseInput.resalePrice - (houseInput.resalePrice * 0.12) - ((3000 / 365) * 120) - ((100 / 365) * 120) - houseInput.rehabPrice) + 70)
        - ((3000 / 365) * 120) - ((100 / 365) * 120) - houseInput.rehabPrice
        * (1 + (-0.18 - 0.03))))

    houseInput.equity = Math.floor((houseInput.purchasePrice - (houseInput.purchasePrice * 0.12)
        - (0.0068 * -(houseInput.purchasePrice - (houseInput.purchasePrice * 0.12) - ((3000 / 365) * 120) - ((10 / 365) * 120) - houseInput.rehabPrice) + 70)
        - ((3000 / 365) * 120) - ((10 / 365) * 120) - houseInput.rehabPrice)
        * (1 + (-0.18 + 0.03)))
        -
        (houseInput.purchasePrice * 0.12)
        -
        -(0.0068 * -(houseInput.purchasePrice - (houseInput.purchasePrice * 0.12) - ((3000 / 365) * 120) - ((10 / 365) * 120) - houseInput.rehabPrice) + 70)
        -
        ((3000 / 365) * 120) - ((10 / 365) * 120) - houseInput.rehabPrice

    fs.readFile('db.json', 'utf-8', (err, data) => {
        var houseStore = JSON.parse(data);
        houseStore.push(houseInput);
        fs.writeFile('db.json', JSON.stringify(houseStore), err => {
            if (err) err;
            res.json(houseInput)
        })
    })
})

app.listen(PORT, () => {
    console.log(`App listening on PORT 3000`)
})



