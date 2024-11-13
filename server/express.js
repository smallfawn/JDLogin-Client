const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')
const config = require('./config.json')
const fs = require('fs');
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
    const { username } = req.query
    if (!(username)) {
        res.send({ status: 'error', msg: '参数错误' })
        return
    }
    if (username === 'admin' || username == '123' || username == '12345' || username == '123456' || username.length < 3) {
        res.send({ status: 'error', msg: '用户名或密码错误' })
        return
    }
    //
    const users = fs.readFileSync('user.json', 'utf8')
    let users_json = JSON.parse(users)
    const existingUserIndex = users_json.findIndex(existingUser => existingUser.username == username);
    if (existingUserIndex !== -1) {
        let user = users_json[existingUserIndex]
        if (user['risknum'] >= 2) {
            console.log('账号' + user.username + '已失效，请重新登录 超过2次');
            if ('risktime' in user) {
                if (user['risktime'] > new Date().getTime()) {
                    return res.send({ status: 'risktime', msg: user['risktime'] })
                }
            }

        }
    }
    //
    let { data: result } = await axios.get(config.server + '/set?key=' + config.key + '&username=' + username)
    //console.log(result)
    res.send(result)
})
app.get('/api/get', async (req, res) => {
    const { username, remark, password } = req.query
    if (!username || !password) {
        res.send({ status: 'error', msg: '参数错误' })
        return
    }

    let { data: result } = await axios.get(config.server + '/get?key=' + config.key + '&username=' + username)
    if (result.status === 'success') {
        let object = result.data
        Object.assign(object, { username })
        Object.assign(object, { password })
        if (remark) {
            Object.assign(object, { remark })
        } else {
            Object.assign(object, { remark: '' })
        }
        let { s, data } = await login(object)
        if (s == 'success') {
            res.send({ status: 'success', msg: '登录成功', data: data })
            return
        } else if (s == 'risk') {
            //如果存在user.json里面有这个user
            //这里给user.json 里面的risknum + 1
            res.send({ status: 'risk', msg: '登录风控', data: data })
            return
        } else if (s == 'risktime') {
            //if(Date.now() > data){}
            res.send({ status: 'risktime', msg: '登录风控今日上限,请于明日再来登录', data: data })
            return
        } else {
            res.send({ status: s, msg: '登录失败', data: data })
            return
        }
    } else {
        res.send({ status: 'wait', msg: '正在登录中', data: username })
        return
    }

})
app.get('/api/auth', async (req, res) => {
    const { key } = req.query
    if (!key) {
        res.send({ status: 'error', msg: '参数错误' })
        return
    }
    let { data: result } = await axios.get(config.server + '/auth?key=' + key)
    res.send(result)
})


app.listen(port, () => {
    console.log(`运行内部端口 ${port}`)
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // 月份是从0开始计数，所以要加1
    var day = currentDate.getDate();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();

    console.log('系统时间===>' + year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds);

})
const cron = require('node-cron')
const cronApi = require('./cron.js')
// 使用cron.schedule来定时执行main函数，这里设置为每天凌晨2点执行（0 0 2 * * *），你可以根据需要修改时间表达式
let defuault_time = '0 25 20,23,2 * * *';
if ('cron' in config) {
    defuault_time = config.cron;
    console.log('定时任务时间设置===>' + defuault_time);

}


const options = {
    timezone: 'Asia/Shanghai'
};

cron.schedule(defuault_time, async () => {
    await cronApi();
}, options);

