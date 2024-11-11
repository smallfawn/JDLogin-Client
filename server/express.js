const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')
const config = require('./config.json')

const login = require('./login.js')
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
    if (!(username && password)) {
        res.send({ status: 'error', msg: '参数错误' })
        return
    }
    let { data: result } = await axios.get(config.server + '/set?key=' + config.key + '&username=' + username + '&password=' + password)
    console.log(result)
    res.send(result)
})
app.get('/api/get', async (req, res) => {
    const { username } = req.query
    if (!username) {
        res.send({ status: 'error', msg: '参数错误' })
        return
    }
    let { data: result } = await axios.get(config.server + '/get?key=' + config.key + '&username=' + username)
    if (result.status === 'success') {
        let { s, data } = await login(result.data)
        if (s == 'success') {
            res.send({ status: 'success', msg: '登录成功', data: '' })
        } else if (s == 'risk') {
            res.send({ status: 'risk', msg: '登录风控', data: data })
        } else {
            res.send({ status: s, msg: '登录失败', data: data })
        }
    } else {
        res.send({ status: 'wait', msg: '正在登录中', data: username })
    }

})
app.get('/api/auth', async (req, res) => {
    const { key } = req.query
    let { data: result } = await axios.get(config.server + '/auth?key=' + key)
    res.send(result)
})


app.listen(port, () => {
    console.log(`运行内部端口 ${port}`)
})