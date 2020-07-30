const port = 5678;
const BASEURL = 'http://localhost:' + port;
const API_LIST = {
    //  查询条件
    node_a: BASEURL + '/node_a',
    // 查询结果
    node_b: BASEURL + '/node_b',
    // 提交注册信息
    register_post: BASEURL + '/register_post',
    // 登陆信息
    userLogin_post: BASEURL + '/userLogin_post',
    // 批量录入商品
    insertGoods: BASEURL + '/insertGoods',
    // 获得商品列表-大类
    getGoodsCategory: BASEURL + '/getGoodsCategory',
    // 根据id，获得对应的商品信息
    getGoodsInfo: BASEURL + '/getGoodsInfo',
    // 查询栏目所属的商品列表
    getCategoryGoodsList: BASEURL + '/getCategoryGoodsList',
    // 分页时触发，
    getPageChange: BASEURL + '/getPageChange',
    // 轮播图
    getImgUrls: BASEURL + '/getImgUrls',
}

module.exports = API_LIST