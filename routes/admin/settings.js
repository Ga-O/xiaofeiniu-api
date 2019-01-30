/**
 * 全局设置相关路由
 */
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;

/**
 * 获取所有的全局设置信息
 * GET  /admin/settings
 * {appName: 'xx', admin: 'xx', appUrl: 'xx',...}
 */
router.get('/', (req,res) => {
  pool.query('SELECT * FROM xfn_settings LIMIT 1', (err, result) => {
    if(err) throw err;
    res.send(result[0]);
  })
})

/**
 * 修改全局设置
 * PUT  /admin/settings
 * 请求数据：{appName: 'xx', admin: 'xx', appUrl: 'xx',...}
 * 返回数据{code: 200, msg: 'settings updated successs'}
 */
router.put('/', (req,res) => {
  pool.query('UPDATE xfn_settings SET ?', req.body, (err, result) => {
    if(err) throw err;
    res.send({code: 200, msg: 'settings updated successs'});
  })
})
