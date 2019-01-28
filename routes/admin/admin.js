/**
 * 管理员相关路由
 */
const express = require('express');
const pool = require('../../pool');
var router = express.Router();
module.exports = router;

/*
*API: GET /admin/login/:aname/:apwd
*完成用户登录验证（有的项目中此处选择POST请求
*返回数据：
*{code: 200, msg: 'login succ'}
*{code: 400, msg：'aname or awpd err'}
*/
router.get('/login/:aname/:apwd', (req, res) => {
  var aname = req.params.aname;
  var apwd = req.params.apwd;
  //console.log(aname,apwd);
  //需要对用户输入的密码执行加密函数
  pool.query('SELECT aid FROM xfn_admin WHERE aname = ? AND apwd = PASSWORD(?)', [aname, apwd], (err, result) => {
    if(err) throw err;
    if(result.length > 0) { //查询到一行数据，登录成功
      res.send({code: 200, msg: 'login success'});
    } else { //没有查询到数据
      res.send({code: 400, msg: 'aname or apwd err'});
    }
  })
})

/*
*API:  PATCH/admin/login  修改部分数据用patch
*请求数据：{aname: 'xxx', oldpwd: 'xxx', newpwd: 'xxx'}
*根据管理员名和密码修改管理员密码
*返回数据：
*{code: 200, msg: 'modified succ'}
*{code: 400, msg：'aname or oldwpd err'}
*{code: 401, msg：'apwd not modified'}
*/
router.patch('/', (req, res) => {
  var data = req.body;//{aname: '', oldPwd: '', newPwd: ''}
  //console.log(data);
  //首先根据aname/oldpwd查询该用户是否存在
  //如果查询到了用户，再修改其密码
  pool.query('SELECT aid FROM xfn_admin WHERE aname = ? AND apwd = PASSWORD(?)', [data.aname, data.oldPwd], (err, result) => {
    if(err) throw err;
    if (result.length == 0 ) {
      res.send({code: 400, msg: 'aname or oldwpd err'});
      return;
    }
    //如果查询到了用户再修改其密码
    pool.query('UPDATE xfn_admin SET apwd =PASSWORD(?) WHERE aname = ?', [data.newPwd, data.aname], (err, result) => {
      if(err) throw err;
      if (result.changedRows > 0) {//密码修改完成
        res.send({code: 200, msg: 'modified success'});
      } else {//新旧密码一样，未做修改
        res.semd({code: 401, msg: 'apwd not modified'});
      }
    })
  })
})