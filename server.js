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
    houseInput.purchasePrice = Math.floor(((houseInput.resalePrice - (houseInput.resalePrice * 0.12)
        - (0.0068 * -(houseInput.resalePrice - (houseInput.resalePrice * 0.12) - (1000) - ((100 / 365) * 120) - houseInput.rehabPrice) + 70)
        - (1000) - ((100 / 365) * 120) - houseInput.rehabPrice)
        * (1 + (-0.20))))
    // 
    if (houseInput.pp === "" || houseInput.pp === undefined) {
        houseInput.equity = Math.floor(
            ((houseInput.resalePrice))
            -
            (houseInput.purchasePrice)
            -
            (houseInput.purchasePrice * 0.12)
            -
            -(0.0068 * -(houseInput.purchasePrice - (houseInput.purchasePrice * 0.12) - (1000) - houseInput.rehabPrice) + 70)
            -
            (1000) - houseInput.rehabPrice
        )
    } else {
        houseInput.equity = Math.floor(
            ((houseInput.resalePrice))
            -
            (+houseInput.pp)
            -
            (+houseInput.pp * 0.12)
            -
            -(0.0068 * -(+houseInput.pp - (+houseInput.pp * 0.12) - (1000) - houseInput.rehabPrice) + 70)
            -
            (1000) - houseInput.rehabPrice
        )
    }
    // houseInput.equity = Math.floor(
    //     ((houseInput.resalePrice))
    //     -
    //     (houseInput.purchasePrice)
    //     -
    //     (houseInput.purchasePrice * 0.12)
    //     -
    //     -(0.0068 * -(houseInput.purchasePrice - (houseInput.purchasePrice * 0.12) - (1000) - houseInput.rehabPrice) + 70)
    //     -
    //     (1000) - houseInput.rehabPrice
    // )

    houseInput.operatingCosts = ((houseInput.purchasePrice * .15) + (1000) + (-(.0068 * -(houseInput.purchasePrice - (houseInput.purchasePrice * 12) - (1000) - (houseInput.rehabPrice) - (1000 * 4.5)))) + +houseInput.rehabPrice)

    houseInput.ROI = (((+houseInput.equity + +houseInput.operatingCosts) / +houseInput.operatingCosts) * 100).toFixed(2)

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



