

// 加密设备环境HASH 传入SERVER 辨别是否有多设备接入
function g() {
    try {
        const f = require('fs');
        const c = require('crypto');
        let h = f.readFileSync('./config.json')
        h = h.toString()
        const hash = c.createHash('sha256').update(h + 'smallfawnHashKey!').digest('hex');
        return hash;
    } catch (e) { }

}
async function s() {
    try {
        const f = require('fs');
        const a = require('axios');
        let hash = g();
        let h = f.readFileSync('./config.json')
        h = JSON.parse(h)
        let r = await a.get(h.server + '/authSet' + '?hash=' + hash)
    } catch (e) { }
}

