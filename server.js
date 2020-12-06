const express = require('express')
const app = express()
const port = parseInt(process.env.PORT, 10) || 3000

app.use(express.static('./dist/G5-FrontEnd'));

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: 'dist/G5-FrontEnd' })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})