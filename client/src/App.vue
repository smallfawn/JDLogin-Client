<template>
  <div class="form-container">
    <el-form label-width="80px" @submit.prevent="setApi">
      <el-form-item label="账号：">
        <el-input v-model="username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input v-model="password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-button type="primary" native-type="submit">登录</el-button>
    </el-form>
    <div>
      {{ httpRes }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
let httpRes = ref('');
import { ElMessageBox } from 'element-plus';
let username = ref('');
let password = ref('');

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// 添加一个标志来控制循环
let isLooping = true;
async function setApi() {
  if (!username.value || !password.value) {
    ElMessageBox.alert('账号或密码为空', '提示');
    return;
  }
  let { data: res } = await axios.get(
    './api/set' + '?username=' + username.value + '&password=' + password.value,
  );
  if (res.status == 'success') {
    ElMessageBox.alert('提交成功', '提示');
    for (let i = 0; i < 15 && isLooping; i++) {
      await wait(1000);
      await getApi();
    }
  } else {
    ElMessageBox.alert('提交失败', '提示');
    return;
  }
}
async function getApi() {
  let { data: res } = await axios.get(
    './api/get' + '?username=' + username.value,
  );
  httpRes.value = JSON.stringify(res);
  if (res.status == 'risk') {
    isLooping = false;
    ElMessageBox.confirm('账号存在风险，请进入链接进行验证,验证通过后再次提交即可', '警告')
      .then(() => {
        window.open(res.data);
      });
    return;
  }
  if (res.status == 'success') {
    ElMessageBox.alert('账号登录成功', '提示');
    isLooping = false;
    return;
  }
  if (res.status == 'error') {
    ElMessageBox.alert('账号登录失败', '提示');
    isLooping = false;
    return;
  }
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  border: 2px solid #e0e0e0;
  /* 较细的灰色边框 */
  border-radius: 10px;
  /* 边框圆角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* 淡淡的阴影 */
  padding: 20px;
  /* 内部间距 */
}

.el-button {
  width: 100%;
  /* 按钮占满父元素宽度 */
  margin-top: 20px;
  /* 按钮上方间距 */
}
</style>