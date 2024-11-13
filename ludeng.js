/**
 * @author smallfawn
 * @name ludeng
 * @team sm
 * @version 1.0.0
 * @description 鹿飞账密登录
 * @rule ^(鹿登|路灯)
 * @admin false
 * @public false
 * @priority 1
 * @disable false

 */
let YourSMJDAPIUrl = 'http://smjd.back1.idcfengye.com'
/* HideStart */
module.exports = async s => {
    const axios = require('axios')
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    if (s.getMsg() == '路灯') {
        await s.reply('请输入京东账号[手机号/用户名] 输入q随时退出');
        let username_input = await s.waitInput(async (s) => {

            let username = s.getMsg();

            let { data: res } = await axios.get(YourSMJDAPIUrl + '/api/set?username=' + username)

            if (res.status == 'success') {
                await s.reply('请输入京东密码 输入q随时退出');
                let password_input = await s.waitInput(async (s) => {

                    let password = s.getMsg();
                    await s.reply('正在登陆中ing');
                    for (let i = 0; i <= 15; i++) {
                        await wait(1000)
                        let { data: res } = await axios.get(YourSMJDAPIUrl + '/api/get?username=' + username + '&password=' + password + '&remark=')
                        if (res.status == 'success') {
                            await s.reply('登录成功')
                            return
                        }
                        if (res.status == 'risk') {
                            await s.reply('登录风控,进链接过验证再来重新登录吧' + res.data)
                            return
                        }
                        if (res.status == 'risktime') {
                            await s.reply('登录风控超过次数限制明天再来吧')
                            return
                        }
                        if (res.status == 'error') {
                            await s.reply(res.msg)
                            return
                        }
                    }



                }, 30);
                if (password_input === null) return s.reply('超时退出');
                if (password_input.getMsg() === 'q') return s.reply('已退出');
            }


        }, 30);
        if (username_input === null) return s.reply('超时退出');
        if (username_input.getMsg() === 'q') return s.reply('已退出');
        //撤回用户发的信息

    }
};
/* HideEnd */