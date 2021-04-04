const express = require('express');
const router = express.Router();

// 引入数据库模块
var MongoClient = require('mongodb').MongoClient

let objectId = require('mongodb').ObjectId
let url = "mongodb://localhost:27017/userinfo"
// 封装连接数据库的方法
function getDb(callback) {
    MongoClient.connect(url, (err, db) => {
        callback(err, db)
    })
}
// 引入表单模块
var multiparty = require('multiparty')
// 引入fs文件处理模块
let fs = require('fs');
router.get("/ip", (req, res) => {
    fs.readFile("./router/ip.txt", 'utf-8', (err, data) => {
        // console.log(err);
        //null 没有错误
        // console.log(data);
        //不存在自动创建文件
        if (err) {
            return res.json({ status: -1, info: '配置文件丢失！' })
        } else {
            return res.json({ status: 1, info: '配置文件获取成功！', data: data })
        }

    })
})
router.get("/config", (req, res) => {
    fs.readFile("./router/config.json", 'utf-8', (err, data) => {
        // console.log(err);
        //null 没有错误
        // console.log(data);
        //不存在自动创建文件
        if (err) {
            return res.json({ status: -1, info: '配置文件丢失！' })
        } else {
            return res.json({ status: 1, info: '配置文件获取成功！', data: JSON.parse(data) })
        }

    })
})

// 用户信息操作
//  用户信息添加路由
router.post("/adduser", (req, res) => {
    let form = new multiparty.Form()
    // 设置图片上传路径
    form.uploadDir = "static/upload";

    form.parse(req, (err, fields, files) => {
        let username = fields.username[0];
        let call = fields.call[0];
        let address = fields.address[0];
        let buy = fields.buy[0];
        let sfz = fields.sfz[0];
        let sex = fields.sex[0];
        let birthday = fields.birthday[0]
        let date = fields.date[0];  //买保险
        let brand = fields.brand[0];  //车牌号
        let date1 = fields.date1[0]; //购车
        let date_sc = fields.date_sc[0]; //审车
        let date_jsz = fields.date_jsz[0]; //审车
        let Moto = fields.Moto[0];
        let MotoType = fields.MotoType[0];
        let Money = fields.Money[0];
        let desc = fields.desc[0];
        let code = fields.code[0];
        let code_sc = fields.code_sc[0];
        let bx_true = fields.bx_true[0];
        let sc_true = fields.sc_true[0];
        let img = ""
        let img_xszfm = ""
        let img_qs = ""
        let img_new = ""
        let img_jsz = ""
        // 行驶证图片
        if (JSON.stringify(files) != "{}") {
            if (files.img != undefined) {
                img = files.img[0].path;
                img = img.substr(img.indexOf('\\') + 1);
            }
            if (files.img_qs != undefined) {
                //合格证图片
                img_qs = files.img_qs[0].path;
                img_qs = img_qs.substr(img_qs.indexOf('\\') + 1);
            }
            if (files.img_new != undefined) {
                // 新车合照
                img_new = files.img_new[0].path;
                img_new = img_new.substr(img_new.indexOf('\\') + 1);
            }
            if (files.img_jsz != undefined) {
                img_jsz = files.img_jsz[0].path;
                img_jsz = img_jsz.substr(img_jsz.indexOf('\\') + 1);
            }
            if (files.img_xszfm != undefined) {
                img_xszfm = files.img_xszfm[0].path;
                img_xszfm = img_xszfm.substr(img_xszfm.indexOf('\\') + 1);
            }
        };
        let insertData = { username, call, sfz, sex, birthday, address, brand, buy, date, date1, date_sc, date_jsz, Moto, MotoType, Money, desc, img, img_xszfm, img_qs, img_new, img_jsz, code, code_sc, sc_true, bx_true }
        getDb((err, db) => {
            db.collection('user').insertOne(insertData, (error, result) => {
                if (error) {
                    return res.json({ status: -1, info: '添加失败' })
                } else {
                    return res.json({ status: 1, info: '添加成功' })
                }
            })
        })
    })

})
// 用户信息更新
router.post("/update", (req, res) => {
    // console.log(req)
    let _id = objectId(req.body._id)
    // console.log(_id)
    let username = req.body.username
    let call = req.body.call
    let address = req.body.address
    let buy = req.body.buy
    let brand = req.body.brand
    let sfz = req.body.sfz;
    let sex = req.body.sex;
    let birthday = req.body.birthday
    if (sfz == "") {
        sex = ""
        birthday = ""
    }
    let date = req.body.date
    let date1 = req.body.date1
    let date_sc = req.body.date_sc
    let Moto = req.body.Moto
    let MotoType = req.body.MotoType
    let Money = req.body.Money
    let desc = req.body.desc
    let towns = req.body.towns
    let code = req.body.code
    let code_sc = req.body.code_sc;
    let sc_true = req.body.sc_true;
    let bx_true = req.body.bx_true;


    let updateData = { $set: { username, call, address, buy, sfz, sex, brand, birthday, date, date1, date_sc, Moto, MotoType, Money, desc, towns, code, code_sc, bx_true, sc_true} };
    getDb((err, db) => {
        db.collection("user").updateOne({ _id }, updateData, (error, result) => {
            if (error) {
                return res.json({ status: -1, info: '修改失败' })
            } else {
                return res.json({ status: 1, info: '修改成功' })
            }
        })
    })
})
// 修改行驶证图片
router.post("/editimg", (req, res) => {
    // console.log(req.body)
    let form = new multiparty.Form()
    // 设置图片上传路径
    form.uploadDir = "static/upload";
    form.parse(req, (err, fields, files) => {
        let oldimg = fields.oldimg[0].slice(-35)  //旧图地址
        fs.unlink("./static/" + oldimg, (err) => {
        })  //删除旧图
        let img = files.img[0].path;

        img = img.substr(img.indexOf('\\') + 1);
        // if (files.lengt > 0) {
        let _id = objectId(fields._id[0])
        getDb((err, db) => {
            db.collection('user').updateOne({ _id }, { $set: { img } }, (error, result) => {
                if (error) {
                    return res.json({ status: -1, info: '修改失败' })
                } else {
                    return res.json({ status: 1, info: '修改成功' })
                }
            })
        })
        // }

    })
})
//反面
router.post("/editimg_xszfm", (req, res) => {
    // console.log(req.body)
    let form = new multiparty.Form()
    // 设置图片上传路径
    form.uploadDir = "static/upload";
    form.parse(req, (err, fields, files) => {
        let oldimg = fields.oldimg[0].slice(-35)  //旧图地址
        fs.unlink("./static/" + oldimg, (err) => {
        })  //删除旧图
        let img_xszfm = files.img_xszfm[0].path;

        img_xszfm = img_xszfm.substr(img_xszfm.indexOf('\\') + 1);
        // if (files.lengt > 0) {
        let _id = objectId(fields._id[0])
        getDb((err, db) => {
            db.collection('user').updateOne({ _id }, { $set: { img_xszfm } }, (error, result) => {
                if (error) {
                    return res.json({ status: -1, info: '修改失败' })
                } else {
                    return res.json({ status: 1, info: '修改成功' })
                }
            })
        })
        // }

    })
})
// 合格证
router.post("/editimg_qs", (req, res) => {
    // console.log(req.body)
    let form = new multiparty.Form()
    // 设置图片上传路径
    form.uploadDir = "static/upload";
    form.parse(req, (err, fields, files) => {
        let oldimg = fields.oldimg[0].slice(-35)  //旧图地址
        fs.unlink("./static/" + oldimg, (err) => {
        })  //删除旧图
        let img_qs = files.img_qs[0].path;
        img_qs = img_qs.substr(img_qs.indexOf('\\') + 1);
        // if (files.lengt > 0) {
        let _id = objectId(fields._id[0])
        getDb((err, db) => {
            db.collection('user').updateOne({ _id }, { $set: { img_qs } }, (error, result) => {
                if (error) {
                    return res.json({ status: -1, info: '修改失败' })
                } else {
                    return res.json({ status: 1, info: '修改成功' })
                }
            })
        })
        // }

    })
})
// 新车合照
router.post("/editimg_new", (req, res) => {
    // console.log(req.body)
    let form = new multiparty.Form()
    // 设置图片上传路径
    form.uploadDir = "static/upload";
    form.parse(req, (err, fields, files) => {
        let oldimg = fields.oldimg[0].slice(-35)  //旧图地址
        fs.unlink("./static/" + oldimg, (err) => {
        })  //删除旧图
        let img_new = files.img_new[0].path;
        img_new = img_new.substr(img_new.indexOf('\\') + 1);
        // if (files.lengt > 0) {
        let _id = objectId(fields._id[0])
        getDb((err, db) => {
            db.collection('user').updateOne({ _id }, { $set: { img_new } }, (error, result) => {
                if (error) {
                    return res.json({ status: -1, info: '修改失败' })
                } else {
                    return res.json({ status: 1, info: '修改成功' })
                }
            })
        })
        // }

    })
})

// jsz
router.post("/editimg_jsz", (req, res) => {
    // console.log(req.body)
    let form = new multiparty.Form()
    // 设置图片上传路径
    form.uploadDir = "static/upload";
    form.parse(req, (err, fields, files) => {
        let oldimg = fields.oldimg[0].slice(-35)  //旧图地址
        fs.unlink("./static/" + oldimg, (err) => {
        })  //删除旧图
        let img_jsz = files.img_jsz[0].path;
        img_jsz = img_jsz.substr(img_jsz.indexOf('\\') + 1);
        // if (files.lengt > 0) {
        let _id = objectId(fields._id[0])
        getDb((err, db) => {
            db.collection('user').updateOne({ _id }, { $set: { img_jsz } }, (error, result) => {
                if (error) {
                    return res.json({ status: -1, info: '修改失败' })
                } else {
                    return res.json({ status: 1, info: '修改成功' })
                }
            })
        })
        // }

    })
})
//  用户信息查找路由
router.post("/finduser", (req, res) => {
    // console.log(req.body)
    if (req.body.id == "LXuao") {
        getDb((err, db) => {
            db.collection('user').find().toArray((error, result) => {
                return res.json({ status: 1, info: '获取成功', data: result })
            })
        })
    }

})
//  单个用户信息查找路由
router.post("/findone", (req, res) => {
    // console.log(req.body)
    let _id = objectId(req.body.id)
    getDb((err, db) => {
        db.collection('user').find({ _id }).toArray((error, result) => {
            return res.json({ status: 1, info: '获取成功', data: result })
        })
    })
})
// 删除用户信息
router.post("/deluser", (req, res) => {
    // 获取基本参数(id)
    let _id = objectId(req.body.id)
    // console.log(req.body.imgurl)
    fs.unlink("./" + req.body.imgurl, (err) => {
    })
    fs.unlink("./" + req.body.img_qs, (err) => {
    })
    fs.unlink("./" + req.body.img_new, (err) => {
    })
    fs.unlink("./" + req.body.img_jsz, (err) => {
    })
    // 执行删除操作
    getDb((err, db) => {
        db.collection('user').deleteOne({ _id }, (error, result) => {
            if (error) {
                return res.json({ status: -1, info: '删除失败' })
            } else {
                return res.json({ status: 1, info: '删除成功' })
                
            }
        })
    })
})
// 模糊查询信息
router.post("/finduserinfo", (req, res) => {
    let reg = new RegExp(req.body.info)
    getDb((err, db) => {
        db.collection('user').find({
            $or: [{ "username": reg }, { "towns": reg }, { "address": reg }, { "call": reg }, { "MotoType": reg }]
        }).toArray((error, result) => {
            if (error) {
                return res.json({ status: -1, info: '查找失败' })
            } else {
                return res.json({ status: 1, info: '查找成功', data: result })

            }
        })
    })
    // if(req.body)
})
// 查询买保险当月的用户详细信息
router.post("/findbx", (req, res) => {
    // console.log(req.body)
    let code = req.body.date
    getDb((err, db) => {
        db.collection('user').find({ code }).toArray((error, result) => {
            return res.json({ status: 1, info: '获取成功', data: result })
        })
    })
})


// 导出路由
module.exports = router;
/** 更新日志
 * V3.4.1
 * 2021-3-7   新增跨年修改买保险和审车为false
 *            新增添加行驶证反面图片
 * 2021-3-8   移除修改购保true为独立文件
 *            ip地址独立文件，后期直接修改log文件
 *            当年审车设置为橙色，需要骑车的设置为红色
 * 2021-3-15  新增登陆验证，取消首次购保，首次审车提示
 *            审车提示修改为首次审车
 * 更新测试
 * 2021-3-26 v3.5.8
 *            新增修改图片后不影响已填信息
 * 2021-3-30 v3.5.9
 *            驾驶证高亮提示
 * */
