<template>
  <div class="wrapDiv">
    <input type="text" v-model="name" @blur="nameBlurFn" class="goodsEntry" placeholder="输入名称" />
    <input type="text" v-model="price" @blur="priceBlurFn" class="goodsEntry" placeholder="输入价格" />
    <input
      type="text"
      v-model="describe"
      @blur="describeBlurFn"
      class="goodsEntry"
      placeholder="输入描述"
    />
    <input type="text" v-model="image" @blur="imageBlurFn" class="goodsEntry" placeholder="输入图片" />
  </div>
</template>

<script>
export default {
  name: "entryGoods",

  data() {
    return {
      name: "",
      price: "",
      describe: "",
      image: "",
      itemGoodsInfo: {
        n: "",
        p: "",
        d: "",
        i: ""
      }
    };
  },
  methods: {
    nameBlurFn() {
      this.itemGoodsInfo.n = this.name;
      this.isInpuCheckFn();
    },
    priceBlurFn() {
      this.itemGoodsInfo.p = this.price;
      this.isInpuCheckFn();
    },
    describeBlurFn() {
      this.itemGoodsInfo.d = this.describe;
      this.isInpuCheckFn();
    },
    imageBlurFn() {
      this.itemGoodsInfo.i = this.image;
      this.isInpuCheckFn();
    },
    // 检查四个框 是否都填完了
    isInpuCheckFn() {
      // console.log(this.itemGoodsInfo);
      let _is = true;

      for (let i in this.itemGoodsInfo) {
        if (!this.itemGoodsInfo[i]) {
          _is = false;
          break;
        }
      }
      if (_is) {
        // console.log("全写完了");
        this.$emit("pushGoodsInfo", this.itemGoodsInfo);
      } else {
        // console.log("没写完");
        this.$emit("isVoidFalse");
      }
    }
  }
};
</script>

<style type="text/css">
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
.cle:after {
  content: ".";
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.wrapDiv {
  width: 80%;
  overflow: hidden;
  border: 1px solid #666;
  background: #eee;
  border-radius: 10px;
  margin: 10px auto;
}
.wrapDiv p.tip {
  font-size: 22px;
  text-align: center;
  padding: 0;
  margin: 5px 0;
  color: #666;
}
.goodsEntry {
  float: left;
  width: 30%;
  margin: 10px;
  border-radius: 10px;
  border: 1px solid #999;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
}
</style>