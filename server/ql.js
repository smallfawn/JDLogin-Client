class QingLong {
    /**
     * 对接青龙API
     * @param {*} HOST http://127.0.0.1:5700
     * @param {*} Client_ID xxx
     * @param {*} Client_Secret xxx
     */
    constructor(HOST, Client_ID, Client_Secret) {
        this.host = HOST;
        this.clientId = Client_ID;
        this.clientSecret = Client_Secret;
        this.token = "";
        this.envs = [];
    }

    // 处理请求
    async request(t, m = "GET") {
        try {
            let { headers: h, params, body: b, url: u } = t;
            // 处理 GET 请求头部
            if (m.toUpperCase() === "GET" && params) {
                let queryString = new URLSearchParams(params).toString();
                u = `${u}?${queryString}`;
            }
            let opts = {
                method: m.toUpperCase(),
                headers: h,
                body: b
            };


            let response = await fetch(u, opts);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let res = await response.json();
            return res;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // 获取用户密钥
    async getAuthToken() {
        const options = {
            url: `${this.host}/open/auth/token`,
            params: {
                client_id: this.clientId,
                client_secret: this.clientSecret,
            },
        };
        try {
            console.log(`传入参数: ${JSON.stringify(options)}`);
            const { code, data, message } = await this.request(options);
            if (code === 200) {
                const { token, token_type, expiration } = data;
                this.token = `${token_type} ${token}`;
            } else {
                throw message || "Failed to obtain user token.";
            }
        } catch (e) {
            throw e ? (typeof e === "object" ? JSON.stringify(e) : e) : "Network Error.";
        }
    }

    // 获取所有环境变量详情
    async getEnvs() {
        const options = {
            url: `${this.host}/open/envs`,
            headers: {
                'Authorization': this.token,
            },
        };
        try {
            const { code, data, message } = await this.request(options);
            if (code === 200) {
                this.envs = data;
                console.log(`✅Obtaining environment variables succeeded.`);
            } else {
                throw message || `Failed to obtain the environment variable.`;
            }
        } catch (e) {
            throw e ? (typeof e === "object" ? JSON.stringify(e) : e) : "Network Error.";
        }
    }

    checkEnvByName(name) {
        return this.envs.findIndex((item) => item.name === name);
    }

    checkEnvByRemarks(remarks) {
        return this.envs.findIndex((item) => item.remarks === remarks);
    }

    checkEnvByValue(value, regex) {
        const match = value.match(regex);
        if (match) {
            const index = this.envs.findIndex((item) =>
                item.value.includes(match[0])
            );
            if (index > -1) {
                //console.log(`🆗${value} Matched: ${match[0]}`);
                return index;
            } else {
                //console.log(`⭕${value} No Matched`);
                return -1;
            }
        } else {
            //console.log(`⭕${value} No Matched`);
            return -1;
        }
    }

    selectEnvByName(name) {
        return this.envs.filter((item) => item.name === name);
    }

    selectEnvByRemarks(remarks) {
        return this.envs.filter((item) => item.remarks === remarks);
    }

    /**
     * 添加环境变量
     * @param {*} array [{value:'变量值',name:'变量名',remarks:'备注'}]
     */
    async addEnv(array) {
        const options = {
            url: `${this.host}/open/envs`,
            headers: {
                Authorization: this.token,
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(array),
        };

        try {
            const { code, message } = await this.request(options, "post");
            if (code === 200) {
                console.log(`✅The environment variable was added successfully.`);
            } else {
                throw message || "Failed to add the environment variable.";
            }
        } catch (e) {
            throw e ? (typeof e === "object" ? JSON.stringify(e) : e) : "Network Error.";
        }
    }

    /**
     * 修改环境变量
     * @param {*} obj {value:'变量值',name:'变量名',remarks:'备注',id:0}
     */
    async updateEnv(obj) {
        const options = {
            url: `${this.host}/open/envs`,
            method: "put",
            headers: {
                Authorization: this.token,
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(obj),
        };
        //console.log(options);
        
        try {
            const { code, message } = await this.request(options, "put");
            if (code === 200) {
                console.log(`✅The environment variable was updated successfully.`);
                //await this.enableEnv([obj._id]);
            } else {
                throw message || "Failed to update the environment variable.";
            }
        } catch (e) {
            throw e ? (typeof e === "object" ? JSON.stringify(e) : e) : "Network Error.";
        }
    }

    /**
     * 删除环境变量
     * @param {*} ids [0,1,2] -> id数组
     */
    async deleteEnv(ids) {
        const options = {
            url: `${this.host}/open/envs`,
            method: "delete",
            headers: {
                Authorization: `${this.token}`,
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(ids),
        };
        try {
            const { code, message } = await this.request(options, "post");
            if (code === 200) {
                console.log(`✅The environment variable was deleted successfully.`);
            } else {
                throw message || "Failed to delete the environment variable.";
            }
        } catch (e) {
            throw e ? (typeof e === "object" ? JSON.stringify(e) : e) : "Network Error.";
        }
    }

    /**
     * 启用环境变量
     * @param {*} ids [0,1,2] -> id数组
     */
    async enableEnv(ids) {
        const options = {
            url: `${this.host}/open/envs/enable`,
            method: "put",
            headers: {
                Authorization: `${this.token}`,
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(ids),
        };
        console.log(options);
        
        try {
            const { code, message } = await this.request(options, "put");
            if (code === 200) {
                console.log(`✅The environment variable was enabled successfully.`);
            } else {
                throw message || "Failed to enable the environment variable.";
            }
        } catch (e) {
            throw e ? (typeof e === "object" ? JSON.stringify(e) : e) : "Network Error.";
        }
    }

    /**
     * 获取单个环境变量详情
     * @param {*} id
     * @returns 变量id
     */
    async getEnvById(id) {
        const options = {
            url: `${this.host}/open/envs/${id}`,
            headers: {
                Authorization: `${this.token}`,
            },
        };
        try {
            const { code, data, message } = await this.request(options);
            console.log(data);
            console.log(data.value);
            if (code === 200) {
                return data;
            } else {
                throw message || `Failed to get the environment variable.`;
            }
        } catch (e) {
            throw e ? (typeof e === "object" ? JSON.stringify(e) : e) : "Network Error.";
        }
    }
}


module.exports = async function main(updateCookie) {
    const config = require('./config.json');
    let ql = new QingLong(config.qlhost, config.qlappid, config.qlsecret);
    await ql.getAuthToken()
    await ql.getEnvs()
    for (let i = 0; i < ql.envs.length; i++) {
        if (ql.envs[i].name == 'JD_COOKIE') {
            if (ql.checkEnvByValue(updateCookie, /pt_pin=([^;]+);/) > -1) {
                await ql.updateEnv({
                    name: ql.envs[i].name,
                    value: updateCookie,
                    remarks: ql.envs[i].remarks,
                    id: ql.envs[i].id
                })
                if (ql.envs[i].status !== 0) {
                    console.log(ql.envs[i]);
                    
                    await ql.enableEnv([ql.envs[i].id])
                }

            }
        }
    }
    let found = false;
    
    for (let i = 0; i < ql.envs.length; i++) {
        if (ql.envs[i].name == 'JD_COOKIE' && ql.checkEnvByValue(updateCookie, /pt_pin=([^;]+);/) > -1) {
            found = true;
            break;
        }
    }

    if (!found) {
        ql.addEnv([{ value: updateCookie, name: 'JD_COOKIE', remarks: '备注' }])
    }

}
