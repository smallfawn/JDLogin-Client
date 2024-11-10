const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')
const config = require('./config.json')
const ql = require('./ql.js')
app.use(express.static('template'));
/*app.get('/', async (req, res) => {
    let { data: result } = await axios.get(config.server + '/auth?key=' + config.key)
    if (result.status === 'success') {
        res.sendFile(__dirname + '/template/');
    } else[
        res.send('许可证已过期/失效，请联系管理员')
    ]


});*/
app.get('/api/set', async (req, res) => {
    const { username, password } = req.query
    let { data: result } = await axios.get(config.server + '/set?key=' + config.key + '&username=' + username + '&password=' + password)
    console.log(result)
    res.send(result)
})
app.get('/api/get', async (req, res) => {
    const { username } = req.query
    let { data: result } = await axios.get(config.server + '/get?key=' + config.key + '&username=' + username)
    if (result.status === 'end') {
        await ql(result.cookie)
    }
    res.send(result)
})
app.get('/api/auth', async (req, res) => {
    const { key } = req.query
    let { data: result } = await axios.get(config.server + '/auth?key=' + key)
    res.send(result)
})


app.listen(port, () => {
    console.log(`运行内部端口 ${port}`)
})