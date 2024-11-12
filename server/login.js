
const axios = require('axios');
const { update } = require('./ql.js')
const fs = require('fs')
async function request(options) {

    let result = await axios.request(options);
    return result;
}
module.exports = async function login_pwd(object) {
    let options = {
        url: "https://plogin.m.jd.com/cgi-bin/mm/domlogin",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": `guid=${object.guid}; lsid=${object.lsid}; lstoken=${object.lstoken}; lang=chs;`,
            "Origin": "https://plogin.m.jd.com",
            "Priority": "u=1, i",
            "Referer": "https://plogin.m.jd.com/login/login?appid=300&returnurl=https%3A%2F%2Fm.jd.com%2F&source=wq_passport",
            "Sec-Ch-Ua": "\"Chromium\";v=\"9\", \"Not?A_Brand\";v=\"8\"",
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": "\"Windows\"",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SLBrowser/9.0.5.8121 SLBChan/103 SLBVPV/64-bit"
        },
        data: {
            "seg_enc": "0",
            "verifytoken": object.vtoken,
            "s_token": object.lstoken,
            "h5st": "20241110141941311;eff8ffqv1zurk997;ad8e6;tk03wafc81c3218ngn1Dlvc3tyVl5VkYu-ek3o9BUBOn5-hNNXCrGi1ULdMOT0LwqucjnfEb8YwtH9ThEyS0FZIWyHLM;447908ad767e35f16c5c7af689495402;4.9;1731219581311;q3EpJPYdy-FP2CUf1mESFKISFWFjLDIj7SFjLrJp-TYfLDIj9e1TJrpjh7Jj0T4T4jofGiVd3noSGSIe4nlSHq4eJWFf0fIf2PYe2fFjLDIj7SnQEiVS0ipjLDrgJX4f3Tof0T1e5jle6jod3nYSynle0bFfIelSGi1f5ToeJrJdJfUT1yVTIipjLDrgJjIgyzpe1uWS-GFSMWoRJrJdJTEjLrJp-jZgz-HPIWWWjaoYAaHjLDIj_ulS9mFPJrpjh7Jj5fIQCOGjLDIjFqEjLrJp-3kjLDrfLDIjzXETJrpjLrJp-jJjLDIj0XETJrpjLrJp-rYfLDIj1XETJrpjLrJp-rojxjZe2iFjLrpjLDrg7rJdJbYOJipjLrpjh7Zf1rJdJfYOJipjLrpjh7Jf_rJdJjYOJipjLrpjh7Jj2zZf9r4UGaUR-ipjxjZf2iFjLrpjLDrg7rJdJ-1OJrpjLrJp-jojxj5P-ipjLrpjh7pfLDIj-ipjLrpjh7pfLDIjHOEjLrpjLD7NLDIjHyVS3KUSJrpjh7ZMwqJdJrkPJrpjh7Jj3ToNL-oe1zVRUq5d7zpf6rpWdq5P0ulS9G1WJrJdJnVO4ipjLD7N;03fde3495c95f507af4b070d338e2314",
            "_stk": "s_token,seg_enc,verifytoken",
            "username": object.phone,
            "pwd": object.pwd,
            "risk_jd[eid]": object.jseid,
            "risk_jd[fp]": object.jsfp,
            "risk_jd[sdkToken]": "",
            "risk_jd[token]": object.jstoken,
            "risk_jd[jstub]": object.jstub
        }

    }

    //console.log(options);

    let res = await request(options)
    if (res.data.err_code == 0) { } else {
        console.log(res.data);
    }

    //console.log(res);

    /*if (res.data.err_code == 128) {
        object.risk = true
        const regex = /token=([^&]+)/;
        const match = res.data.succcb.match(regex);
        if (match && match[1]) {
            const token = match[1];
            Object.assign(object, { risktoken: token })
            const risk_code = require('./risk_code.js')
            await risk_code(object)
        } else {
            console.log("未找到token值");
        }
    }*/
    if (res.data.err_code == 0) {
        let pt_keyValue = "";
        let pt_pinValue = "";
        res.headers["set-cookie"].forEach(cookie => {
            const pt_keyMatch = cookie.match(/pt_key=(.*?)(;|$)/);
            if (pt_keyMatch && pt_keyMatch[1]) {
                pt_keyValue = `pt_key=${pt_keyMatch[1]}`;
            }
            const pt_pinMatch = cookie.match(/pt_pin=(.*?)(;|$)/);
            if (pt_pinMatch && pt_pinMatch[1]) {
                pt_pinValue = `pt_pin=${pt_pinMatch[1]}`;
            }
        });
        const cookies = `${pt_keyValue}; ${pt_pinValue};`;
        await update(cookies, object.remark)
        //保存到user.json
        let user = {
            risknum: 0,
            username: object.username,
            password: object.password,
            pt_pin: cookies.match(/pt_pin=(.*?);/)[1]
        }

        const users = fs.readFileSync('user.json', 'utf8')
        let users_json = JSON.parse(users)
        // 检查是否存在相同用户名的用户，若存在则更新
        const existingUserIndex = users_json.findIndex(existingUser => existingUser.username == user.username);
        if (existingUserIndex !== -1) {
            users_json[existingUserIndex] = user;
        } else {
            users_json.push(user);
        }

        // 将更新后的用户数据写回文件
        fs.writeFileSync('user.json', JSON.stringify(users_json, null, 2));
        return { s: 'success', data: 'pt_pin=' + user.pt_pin + ';' }
    } else if (res.data.err_code == 128 || res.data.err_code == 142) {
        object.status = 'risk'
        return { s: 'risk', data: res.data.succcb }
    } else {
        return { s: 'error', data: res.data.err_msg }
    }
    //6密不对
    //7账号不对
    //198 账密不匹配




}