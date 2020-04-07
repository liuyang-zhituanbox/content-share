const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ResponseJson = require('./ResponseJson');
const MemberCache = require('./MemberCache');
const cacheManager = require('cache-manager');
const memoryCache = cacheManager.caching({store: 'memory', max: 500, ttl: 60 * 10/*seconds*/});

const KEY_PREFIX = 'content-share-';
//创建application/json解析
app.use(bodyParser.json());

//创建application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// 将 HTML 请求体做为字符串处理
app.use(bodyParser.text({type: 'text/plain'}));

app.get('/', function (req, res) {
    res.send('Hello World!');
});
/**
 * 发送文本内容
 */
app.post('/send', async function (req, res) {
    let domain = req.query.domain;
    let body = req.body;
    if (domain === undefined || domain === '') {
        await res.json(ResponseJson.ERROR("domain.not.blank", "域不能为空"));
    } else if (domain.length > 40) {
        await res.json(ResponseJson.ERROR("domain.too.long", "域不能超过40个字符"));
    } else if (typeof body !== 'string') {
        await res.json(ResponseJson.ERROR("body.type.not.support", "只能接受文本"));
    } else if (body.trim() === '') {
        await res.json(ResponseJson.ERROR("body.not.blank", "域不能超过40个字符"));
    } else {
        let memberCache = new MemberCache(memoryCache, domain);
        let memberKey = await memberCache.add(body);
        await res.json(ResponseJson.SUCCESS(memberKey));
    }
    res.end();
});

app.get('/text', async function (req, res) {
    let domain = req.query.domain;
    if (domain === undefined || domain === '') {
        await res.json(ResponseJson.ERROR("domain.not.blank", "域不能为空"));
    } else {
        let memberCache = new MemberCache(memoryCache, domain);
        await res.json(ResponseJson.SUCCESS(await memberCache.values()));
    }
    res.end();
});


app.listen(3000, function () {
    console.log('app listening on port 3000!');
});
