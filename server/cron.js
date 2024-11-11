//定义cron定时执行
//从user.json拿账号密码 然后再次请求登录
const fs = require('fs')
const { QingLong } = require('./ql.js')
const login = require('./login.js')
const axios = require('axios')
const cron = require('node-cron')
function getUsers() {

    return JSON.parse(fs.readFileSync('./user.json', 'utf8'))
}
//利用返回的失效COOKIE数组和正则校验来从users里面匹配对应的账密
function getUserByCookie(cookies, users) {
    //拿到COOKIE里面的pt_pin 正则匹配
    const pt_pin = cookies.match(/pt_pin=(.*?);/)[1]
    return users.find(user => user.pt_pin == pt_pin)
}
/**
 * 拿到状态为禁用的JDCOOKIE 返回数组
 */
async function getCookie() {
    let waitUpdateCookies = []
    let ql = new QingLong()
    await ql.getAuthToken()
    await ql.getEnvs()
    for (let i = 0; i < ql.envs.length; i++) {
        if (ql.envs[i].name == 'JD_COOKIE' && ql.envs[i].status !== 0) {
            waitUpdateCookies.push(ql.envs[i])
        }
    }
    return waitUpdateCookies
}
async function main() {
    let users = getUsers()
    let waitUpdateCookies = await getCookie()
    for (let i of waitUpdateCookies) {
        let user = getUserByCookie(i.value, users)
        if (user) {
            console.log(`开始更新${user.pt_pin}的cookie`)
            await getJDCookies(user.username, user.password)
        }
    }
}


async function getJDCookies(username, password) {
    const config = require('./config.json')
    let { data: result } = await axios.get(config.server + '/set?key=' + config.key + '&username=' + username + '&password=' + password)
    if (result.status === 'success') {
        for (let i = 0; i < 15; i++) {
            let { data: result } = await axios.get(config.server + '/get?key=' + config.key + '&username=' + username)
            if (result.status === 'success') {
                let { s, data } = await login(result.data)
                if (s == 'success') {
                    //res.send({ status: 'success', msg: '登录成功', data: '' })
                    return
                } else if (s == 'risk') {
                    //res.send({ status: 'risk', msg: '登录风控', data: data })
                    return
                } else if (s == 'error' || s == 'fail') {
                    //res.send({ status: s, msg: '登录失败', data: data })
                    return
                }
            }

        }

    }



}
// 使用cron.schedule来定时执行main函数，这里设置为每天凌晨2点执行（0 0 2 * * *），你可以根据需要修改时间表达式
cron.schedule('0 0 3,6,9 * * *', async () => {
    await main();
});