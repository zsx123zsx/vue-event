<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img
        v-if="!avatar"
        class="the_img"
        src="../../assets/images/avatar.jpg"
        alt=""
      />
      <img v-else class="the_img" :src="avatar" alt="" />
      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="iptRef"
          @change="onFileChange"
        />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg"
          >选择图片</el-button
        >
        <el-button
          type="success"
          icon="el-icon-upload"
          :disabled="avatar === ''"
          @click="uploadFn"
          >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateUserAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar: '',
    }
  },
  methods: {
    // 选择图片-> 点击事件
    chooseImg() {
      // 目的：
      this.$refs.iptRef.click()
    },
    // 选择图片确定
    onFileChange(e) {
      // e 原生事件对象
      const files = e.target.files // 拿到用户选择的文件数组
      if (files.length === 0) {
        // 证明刚刚文件选择窗口打开了，但是没有选择文件
      } else {
        // 证明他选择了文件 （默认只能选择1个）
        console.log(files[0])
        // 知识点:img 标签的src值
        // 下面要把图片文件 转换为连接地址
        // 有两种方式
        // 方案1 -->     文件》内存临时地址（这个地址只能在js内存里，不能发给后台）
        // 语法： URL.createObjectURL(文件)
        // 返回值 ： 内存临时文件
        // this.avatar = URL.createObjectURL(files[0])

        // 方案2： 文件 -> base64 字符串(此字符串是可以发给后台的)
        const fr = new FileReader()
        fr.readAsDataURL(files[0]) // 传入文件对象开始读
        fr.onload = (e) => {
          // onload等待把文件读成base64 字符串后会触发onload 事件函数
          // e.target.result 的值就是读完的结果
          this.avatar = e.target.result // 赋予给变量。让他显示在img的src里
        }
      }
    },
    // 开始上传头像
    async uploadFn() {
      const { data: res } = await updateUserAvatarAPI(this.avatar)
      if (res.code !== 0) return this.$message.error(res.message)
      // 更新头像成功
      this.$message.success(res.message)
      // 重新让vuex获取下最新的用户数据
      this.$store.dispatch('getUserInfoAction')
    },
  },
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
