//定义cron定时执行
//从user.json拿账号密码 然后再次请求登录
const fs = require('fs')
const { QingLong } = require('./ql.js')
const login = require('./login.js')
const axios = require('axios')
const config = require('./config.json')
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
    let ql = new QingLong(config.qlhost, config.qlappid, config.qlsecret)
    await ql.getAuthToken()
    await ql.getEnvs()
    for (let i = 0; i < ql.envs.length; i++) {
        if (ql.envs[i].name == 'JD_COOKIE' && ql.envs[i].status !== 0) {
            waitUpdateCookies.push(ql.envs[i])
        }
    }
    return waitUpdateCookies
}
module.exports = async function cronApi() {
    let users = getUsers()
    let waitUpdateCookies = await getCookie()
    for (let i of waitUpdateCookies) {
        let user = getUserByCookie(i.value, users)
        if (user) {
            console.log(`开始更新${user.pt_pin}的cookie`)
            if (user['remark']) {
                await getJDCookies(user.username, user.password, user['remark'])
            } else {
                await getJDCookies(user.username, user.password, '无备注')
            }

        }
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function getJDCookies(username, password, remark = '无备注') {
    let { data: result } = await axios.get(config.server + '/set?key=' + config.key + '&username=' + username + '&password=' + password)
    console.log('set===>' + JSON.stringify(result))
    if (result.status === 'success') {
        for (let i = 0; i < 15; i++) {
            await wait(1000)
            let { data: result } = await axios.get(config.server + '/get?key=' + config.key + '&username=' + username)
            console.log('get===>' + JSON.stringify(result))
            if (result.status === 'success') {
                Object.assign(result.data, { remark })
                let { s, data } = await login(result.data)
                if (s == 'success') {
                    //res.send({ status: 'success', msg: '登录成功', data: '' })
                    console.log(`更新${username}的cookie成功`)
                    return
                } else if (s == 'risk') {
                    console.log(`更新${username}的cookie失败，风控`)
                    //res.send({ status: 'risk', msg: '登录风控', data: data })
                    return
                } else if (s == 'error' || s == 'fail') {
                    console.log(`更新${username}的cookie失败`)
                    //res.send({ status: s, msg: '登录失败', data: data })
                    return
                }
            }

        }

    }



}
