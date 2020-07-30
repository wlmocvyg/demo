var express = require('express');
var app = express();
// 引入mongDB模块，获得他的客户端对象
var MongoClient = require('mongodb').MongoClient;
// mongoDB连接字符串
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/'

// 解决跨域问题，网上成熟的解决方案很多，我是直接拷贝的
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Method", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Max-Age", "3600");
    next();
});

// 用来临时的村数据
var _xxObj = {
    arrs: [{
        id: 'n1',
        name: 'a_name',
        vals: 'aaa'
    },
    {
        id: 'n2',
        name: 'b_name',
        vals: 'bbb'
    },
    {
        id: 'n1',
        name: 'c_name',
        vals: 'ccc'
    },
    ]
}
// 保存过滤的结果，因为现在没有mongDB
var _filterResult = null;

// 过滤方法
function filter(_val) {
    return _xxObj.arrs.filter(_g => {
        return _g.vals === _val
    })
}

// 第一个nodeJS接口,接收
app.get('/node_a', function (req, res) {

    console.log(req.query.v_data);

    let _result = filter(req.query.v_data)
    _filterResult = _result.length !== 0 ? _result : [{ id: 'xxx', name: '没有结果' }]


    res.end();
});
// 第二个接口，发送
app.get('/node_b', function (req, res) {
    res.send(_filterResult)
});
// 用户注册信息
app.post('/register_post', function (req, res) {
    let _allData = ""


    req.on('data', function (_d) {
        _allData += _d
    })
    req.on('end', function () {
        console.log(_allData);
        let _registerMsg = JSON.parse(_allData)
        // 1。在注册新用户之前，先查询有没有同名
        findSameNameFn(_registerMsg, res)
    })
});
// 查询同名注册信息
function findSameNameFn(_registerMsg, res) {
    // 连接数据库
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 集合名：userInfo
        var _collection = _dbo.collection('userInfo')
        _collection.findOne({ 'username': _registerMsg.username }, {}, function (err, result) {
            if (err) throw err;

            if (result === null) {
                // console.log('没有同名');
                insertNewUserName(_registerMsg, res)
            }
            else if (result.username === _registerMsg.username) {
                // console.log("有相同名字");

                res.send({
                    regInfo: "用户名已经存在！",
                    reg_code: 2
                })
            }
            db.close();
        })
    })
}
// 插入新用户注册的数据
function insertNewUserName(_registerMsg, res) {
    // 这个部分有代码。
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 集合名：userInfo
        var _collection = _dbo.collection('userInfo')
        _collection.insertOne(_registerMsg, function (err, result) {
            if (err) throw err;
            // console.log('注册成功！');
            return res.send({
                regInfo: "注册成功！",
                reg_code: 1
            })
            db.close();
        })
    })
}
// 登陆功能
app.post('/userLogin_post', function (req, res) {
    var _loginData = ''
    req.on('data', function (_d) {
        _loginData += _d
    })
    req.on('end', function (_d) {
        // console.log(_loginData);
        let _tem = JSON.parse(_loginData)

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：proShopCart
            var _dbo = db.db('proShopCart')
            // 集合名：userInfo
            var _collection = _dbo.collection('userInfo')
            _collection.findOne({ 'username': _tem.u }, {}, function (err, result) {
                if (err) throw err;
                if (result === null) {
                    console.log('用户不存在');
                    return res.send({
                        regInfo: "用户不存在",
                        reg_code: 5
                    });
                } else if (_tem.p !== result.password) {
                    console.log('密码错误');
                    return res.send({
                        regInfo: "密码错误",
                        reg_code: 4
                    });
                } else if (result !== null && _tem.p == result.password) {
                    console.log('登陆成功');
                    return res.send({
                        regInfo: result,
                        reg_code: 3
                    })
                }
                db.close();
            })
        })
    })
})

// 批量录入商品
app.post('/insertGoods', function (req, res) {
    var _dataObj = '';
    req.on('data', function (_d) {
        _dataObj += _d
    })
    req.on('end', function (_d) {
        let _insertGoodsArrObj = JSON.parse(_dataObj)
        // console.log(_insertGoodsArrObj);
        MongoClient.connect(DB_CONN_STR, function (err, db) {
            // 数据库名：proShopCart
            var _dbo = db.db('proShopCart')
            // 商品栏目集合名：goodsCategory
            var _collection = _dbo.collection('goodsCategory')
            _collection.insertMany(_insertGoodsArrObj, function (err, result) {
                if (err) throw err;

                return res.send({
                    regInfo: "商品录入成功！",
                    reg_code: 5
                })
                db.close();
            })
        })


    })
})

// 获得商品列表-大类
app.get('/getGoodsCategory', function (req, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart');
        // 商品栏目集合名：goodsCategory
        var _collection = _dbo.collection('goodsCategory')

        _collection.aggregate([{
            $lookup: {
                localField: 'd',
                from: 'goodsList_a',
                foreignField: 'category',
                as: 'goodsList_aa'
            }
        }, {
            $lookup: {
                localField: 'd',
                from: 'goodsList_b',
                foreignField: 'category',
                as: 'goodsList_bb'
            }
        }, {
            $lookup: {
                localField: 'd',
                from: 'goodsList_c',
                foreignField: 'category',
                as: 'goodsList_cc'
            }
        }, {
            $lookup: {
                localField: 'd',
                from: 'goodsList_d',
                foreignField: 'category',
                as: 'goodsList_dd'
            }
        }
        ]).toArray(function (err, result) {
            if (err) throw err;
            return res.send(result)
            db.close();
        });
    });
});
// 批量插入商品到db，只运行一次，把商品插入到DB中就ok
function insertTempGoodsList() {
    let TempGoodsListObj = [{ "name": "洗衣机", "price": 22, "category": "goodsList_b", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497575095&di=d4a59272c4cf53848d8b615f208a4d38&imgtype=0&src=http%3A%2F%2Fimg010.hc360.cn%2Fk1%2FM01%2F30%2F25%2F4LLd34735d9f8e3092065fBff467C42d385.png", "describe": " 洗衣机特好，洗的干净" },
    { "name": "燃气灶", "price": 33, "category": "goodsList_b", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497592730&di=21f41bd6f1ddf4178951c7cc1a59515f&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fhousephotolib%2F1610%2F13%2Fc1%2F28285254_1476289213390_690x460.jpg", "describe": " 燃气灶特好，火大" },
    { "name": "冰箱", "price": 44, "category": "goodsList_b", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497740253&di=2a66cd86af34128a3160f36597a7b4f8&imgtype=0&src=http%3A%2F%2Fpic15.photophoto.cn%2F20100610%2F0020033085457192_b.jpg", "describe": " 冰箱特好，凉" },
    {
        "name": "空调", "price": 55, "category": "goodsList_b", "img": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548497798102&di=43fb38fe2fd46d41dab6e4e9ecd66e06&imgtype=0&src=http%3A%2F%2Fsc.jb51.net%2Fuploads%2Fallimg%2F140416%2F11-14041610514b17.jpg", "describe": " 空调特好，冻死个人"
    }
    ]

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 商品栏目集合名：goodsCategory
        var _collection = _dbo.collection('goodsList_b')
        _collection.insertMany(TempGoodsListObj, function (err, result) {
            if (err) throw err;
            db.close();
        })
    })

}
// insertTempGoodsList()

// 根据id，获得对应商品信息
app.get('/getGoodsInfo', function (req, res) {
    var _findId = req.query._id;
    var _c = req.query._c;
    // 引入mongodb的id对象
    var ObjectID = require('mongodb').ObjectID;
    var _findObjId = ObjectID.createFromHexString(_findId);

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 商品栏目集合名：goodsCategory
        var _collection = _dbo.collection(_c)
        _collection.findOne({ "_id": _findObjId }, {}, function (err, result) {
            if (err) throw err;

            return res.send(result)
            db.close();
        })
    })
})
// 查询栏目所属的商品列表
app.get('/getCategoryGoodsList', function (req, res) {
    // 这是各个集合， goodSlist_a ...
    var _c = req.query.categoryId;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 商品栏目集合名：goodsCategory
        var _collection = _dbo.collection(_c)
        _collection.find().toArray(function (err, result) {
            if (err) throw err;

            return res.send(result)
            db.close();
        })
    })
});
app.get('/getPageChange', function (req, res) {
    var _s = req.query.startNum;
    var _c = req.query.c;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        // 数据库名：proShopCart
        var _dbo = db.db('proShopCart')
        // 商品栏目集合名：goodsCategory
        var _collection = _dbo.collection(_c)
        // limit(),限制
        _collection.find().limit(2).skip(Number(_s)).toArray(function (err, result) {
            if (err) throw err;

            return res.send(result)
            db.close();
        })
    })
});

// 轮播图
app.get('/getImgUrls', function (req, res) {
    let imgObj = {
        urls: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547663842854&di=bd40adb24bb9f7559c488dcc18c24faf&imgtype=0&src=http%3A%2F%2Fwx1.sinaimg.cn%2Flarge%2F7f6b590cgy1fh45yi4xpkj20yi0jen74.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547663896385&di=0be734cc730ea2b3d869263784a519d6&imgtype=0&src=http%3A%2F%2Fp2.qhimgs4.com%2Ft01f47e00d96e5546ee.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547663913605&di=a33bd590cdbe71086d835bbb3d124b14&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20171008%2F11444774a5774af7a77bb8eb836c3fd3.jpeg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547663942911&di=5e029b8845848bd7675f66f62c2172cd&imgtype=0&src=http%3A%2F%2Fpic39.photophoto.cn%2F20160422%2F0018031335985159_b.jpg']
    }
    return res.send(imgObj)
})

app.listen(5678, function () {
    console.log('5678已经运行');
})