<template>
  <div class="profile-page">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>个人信息</span>
          </template>
          <div class="profile-avatar">
            <el-avatar :size="100" :icon="UserFilled" />
            <h3>{{ userStore.userInfo?.username || '管理员' }}</h3>
            <p>{{ userStore.userInfo?.role === 'admin' ? '超级管理员' : '普通用户' }}</p>
          </div>
          <div class="profile-info">
            <div class="info-item">
              <label>用户ID：</label>
              <span>{{ userStore.userInfo?.id || '-' }}</span>
            </div>
            <div class="info-item">
              <label>用户名：</label>
              <span>{{ userStore.userInfo?.username || '-' }}</span>
            </div>
            <div class="info-item">
              <label>角色：</label>
              <span>{{ userStore.userInfo?.role || '-' }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>修改个人信息</span>
          </template>
          <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="form.username" disabled placeholder="用户名不可修改" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="handleSubmit">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        
        <el-card style="margin-top: 20px;">
          <template #header>
            <span>登录日志</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(log, index) in loginLogs"
              :key="index"
              :type="log.type"
              :timestamp="log.time"
            >
              {{ log.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref(false)
const formRef = ref()

const form = reactive({
  username: userStore.userInfo?.username || '',
  nickname: '',
  email: '',
  phone: ''
})

const rules = {
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 模拟登录日志
const loginLogs = [
  { type: 'primary', content: '当前登录', time: new Date().toLocaleString() },
  { type: 'success', content: '登录成功', time: new Date(Date.now() - 86400000).toLocaleString() },
  { type: 'success', content: '登录成功', time: new Date(Date.now() - 172800000).toLocaleString() }
]

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        // 这里调用更新用户信息 API
        ElMessage.success('保存成功')
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  // 加载用户信息
  if (userStore.userInfo) {
    form.username = userStore.userInfo.username
  }
})
</script>

<style scoped>
.profile-avatar {
  text-align: center;
  padding: 20px 0;
}

.profile-avatar h3 {
  margin: 16px 0 8px;
  font-size: 20px;
  color: #303133;
}

.profile-avatar p {
  color: #909399;
  font-size: 14px;
}

.profile-info {
  padding: 20px 0;
  border-top: 1px solid #ebeef5;
}

.info-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f5f7fa;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  width: 80px;
  color: #606266;
  font-weight: 500;
}

.info-item span {
  flex: 1;
  color: #303133;
}
</style>
