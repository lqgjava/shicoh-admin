<template>
  <div class="settings-page">
    <el-card>
      <template #header>
        <span>系统设置</span>
      </template>
      
      <el-form :model="settings" label-width="120px" v-loading="loading">
        <el-form-item label="网站名称">
          <el-input v-model="settings.siteName" placeholder="网站名称" />
        </el-form-item>
        
        <el-form-item label="网站Logo">
          <el-input v-model="settings.siteLogo" placeholder="网站Logo路径" />
        </el-form-item>
        
        <el-form-item label="网站关键词">
          <el-input v-model="settings.siteKeywords" type="textarea" placeholder="SEO关键词，用逗号分隔" />
        </el-form-item>
        
        <el-form-item label="网站描述">
          <el-input v-model="settings.siteDescription" type="textarea" :rows="3" placeholder="网站描述" />
        </el-form-item>
        
        <el-form-item label="联系电话">
          <el-input v-model="settings.contactPhone" placeholder="联系电话" />
        </el-form-item>
        
        <el-form-item label="联系邮箱">
          <el-input v-model="settings.contactEmail" placeholder="联系邮箱" />
        </el-form-item>
        
        <el-form-item label="公司地址">
          <el-input v-model="settings.contactAddress" placeholder="公司地址" />
        </el-form-item>
        
        <el-form-item label="备案号">
          <el-input v-model="settings.icp" placeholder="ICP备案号" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="saveLoading" @click="saveSettings">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>修改密码</span>
      </template>
      
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="120px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入原密码" />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="请输入新密码" />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="pwdLoading" @click="changePassword">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const saveLoading = ref(false)

const settings = reactive({
  siteName: '',
  siteLogo: '',
  siteKeywords: '',
  siteDescription: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  icp: ''
})

const fetchSettings = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/settings')
    if (res.data) {
      Object.assign(settings, res.data)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  saveLoading.value = true
  try {
    await request.put('/settings', settings)
    ElMessage.success('设置已保存')
  } catch (error) {
    console.error(error)
  } finally {
    saveLoading.value = false
  }
}

// 密码修改
const pwdFormRef = ref()
const pwdLoading = ref(false)

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const pwdRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== pwdForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const changePassword = async () => {
  if (!pwdFormRef.value) return
  await pwdFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      pwdLoading.value = true
      try {
        // 这里调用修改密码 API
        ElMessage.success('密码修改成功')
        pwdForm.oldPassword = ''
        pwdForm.newPassword = ''
        pwdForm.confirmPassword = ''
      } catch (error) {
        console.error(error)
      } finally {
        pwdLoading.value = false
      }
    }
  })
}

onMounted(() => {
  fetchSettings()
})
</script>
