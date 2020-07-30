<template>
  <div>
    <van-nav-bar :title="msg" left-text="返回" left-arrow @click-left="goBackFn" />
    <van-field
      v-model="username"
      required
      clearable
      label="用户名"
      placeholder="请输入用户名"
      @click-icon="username=''"
      :error-message="userErr"
    />
    <van-field
      v-model="password"
      required
      clearable
      type="password"
      label="密码"
      placeholder="请输入密码"
      @click-icon="username=''"
      :error-message="passrErr"
    />
    <van-field
      v-model="password2"
      required
      clearable
      type="password"
      label="重复密码"
      placeholder="请重复输入密码"
      @click-icon="username=''"
      :error-message="passrErr2"
    />
    <van-field v-model="describe" label="个人签名" placeholder="请输入个人签名" />

    <van-button type="primary" @click="registerFn">立即注册</van-button>
    <van-button type="primary" @click="registerResetBtn">重置</van-button>
    <footerBar></footerBar>
  </div>
</template>

<script>
import axios from "axios";
import API_LIST from "@/APIList.config";
import footerBar from "./footerBar";

export default {
  name: "register",
  data() {
    return {
      msg: "注册页面",
      username: "",
      userErr: "",
      password: "",
      password2: "",
      passrErr: "",
      passrErr2: "",
      describe: ""
    };
  },
  components: { footerBar },
  methods: {
    // 回到上一步
    goBackFn() {
      this.$router.go(-1);
    },

    // 注册
    registerFn() {
      // 每次重置err信息
      this.userErr = "";
      this.passrErr = "";
      this.passrErr2 = "";
      // 注册信息obj
      let _registerObj = {
        username: this.username,
        password: this.password,
        password2: this.password2,
        describe: this.describe
      };

      // 用户注册判断条件

      if (_registerObj.username === "") {
        this.userErr = "用户名不能为空";
        return false;
      }

      if (_registerObj.password === "") {
        this.passrErr = "密码不能为空";
        return false;
      }
      if (_registerObj.password2 === "") {
        this.passrErr2 = "重复密码不能为空";
        return false;
      }
      if (_registerObj.password2 !== _registerObj.password) {
        this.passrErr2 = "密码不一致";
        return false;
      }

      console.log(_registerObj);
      this.postRegisterObj(_registerObj);
    },

    // 提交
    postRegisterObj(_registerObj) {
      axios.post(API_LIST.register_post, _registerObj).then(_d => {
        console.log(_d.data);
        this.$dialog
          .alert({
            message: _d.data.regInfo
          })
          // 注册成功，回到首页
          .then(() => {
            this.$router.push({ path: "/" });
          });
      });
    },

    // 重置
    registerResetBtn() {}
  }
};
</script>

