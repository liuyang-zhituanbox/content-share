const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ResponseJson = require('./ResponseJson');

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
app.post('/send/:domain', function (req, res) {
    let domain = req.params.domain;
    let body = req.body;
    console.log(body);
    if (domain === undefined || domain === '') {
        res.json(ResponseJson.ERROR("domain.is.not.blank", "域不能为空"));
    }
    res.json(ResponseJson.SUCCESS());
    res.end();
});

app.listen(3000, function () {
    console.log('app listening on port 3000!');
});
