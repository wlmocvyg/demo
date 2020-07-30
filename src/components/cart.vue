<template>
  <div>
    <van-nav-bar
      :title="msg"
      left-text="返回"
      right-text="清空购物车"
      left-arrow
      @click-left="goback"
      @click-right="cartEmptyFn"
    />

    <div class="goodsDiv" v-for="item in shopCartList">
      <label>
        <img :src="item._img" />
      </label>
      <h2>{{item._goodsName}},数量{{item._num}},单价{{item._price}}</h2>
      <!-- async-change必须是异步 ，否则将计算点击之前的值-->
      <van-stepper
        v-model="item['_num']"
        :async-change="true"
        @plus="addBtnFn"
        @minus="minusBtnFn"
      />
    </div>
    <van-submit-bar :price="allGoodsMoney *100" :button-text="submitTxt" @submit="onSubmit" />
    <h1 v-if="isCartEmpty">当前购物车是空，请去添加商品</h1>
  </div>
</template>
<script>
import axios from "axios";
import API_LIST from "@/APIList.config";
import { Toast } from "vant";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "cart",
  data() {
    return {
      msg: "购物车",
      cartArr: "",
      allGoodsNum: 0,
      allGoodsMoney: 0,
      submitTxt: "",
      isCartEmpty: false
    };
  },
  created() {
    this.cartArr = localStorage.cartDataInfo
      ? JSON.parse(localStorage.cartDataInfo)
      : [];
    if (this.cartArr.length === 0) {
      this.isCartEmpty = true;
    }
    console.log(this.cartArr);
    // 计算所有商品数量
    this.countAllGoodsNum();
    // 所有商品总价
    this.countAllGoodsMoney();

    // vuex,this.carArr 就是购物车中的商品
    this.addToVuex(this.cartArr);
  },
  computed: {
    // 映射 数据，从vuex里getter里
    ...mapGetters(["shopCartList"])
  },
  methods: {
    // 映射 事件
    ...mapActions(["addToVuex"]),
    // 清空购物车
    cartEmptyFn() {
      this.cartArr = localStorage.removeItem("cartDataInfo");
      this.submitTxt = "去结账(0)";
      this.allGoodsMoney = 0;
      this.isCartEmpty = true;
    },
    // 去结账按钮
    onSubmit() {
      this.$dialog
        .alert({
          message:
            "共" +
            this.allGoodsNum +
            "个商品，" +
            "总共" +
            this.allGoodsMoney +
            "元"
        })
        .then(() => {
          Toast.success("支付成功");
          this.$router.push({ path: "/" }, () => {
            localStorage.setItem("inxState", 0);
          });
        });
    },
    // 计算所有商品总数
    countAllGoodsNum() {
      this.allGoodsNum = 0;
      for (let i = 0; i < this.cartArr.length; i++) {
        this.allGoodsNum += this.cartArr[i]._num;
      }
      this.submitTxt = "去结账" + "(" + this.allGoodsNum + ")";
    },
    // 计算所有商品总价
    countAllGoodsMoney() {
      this.allGoodsMoney = 0;
      for (let i = 0; i < this.cartArr.length; i++) {
        this.allGoodsMoney += this.cartArr[i]._num * this.cartArr[i]._price;
      }
    },
    // 返回上一页
    goback() {
      this.$router.push({ path: "/" }, () => {
        localStorage.setItem("inxState", 0);
      });
    },
    // 加减按钮
    addBtnFn() {
      this.countAllGoodsNum();
      this.countAllGoodsMoney();
    },
    minusBtnFn() {
      this.countAllGoodsNum();
      this.countAllGoodsMoney();
    }
  }
};
</script>>
<style scoped>
.pr {
  position: relative;
}
.pa {
  position: absolute;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
h2.title {
  font-size: 20px;
  text-align: center;
}
.cle:after {
  content: ".";
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.goodsDiv {
  width: 95%;
  margin: 5px auto;
  clear: both;
}
.goodsDiv label {
  float: left;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 10px;
}
.goodsDiv label img {
  width: 100px;
  height: 100px;
}
.goodsDiv h2 {
  font-size: 22px;
}
</style>>