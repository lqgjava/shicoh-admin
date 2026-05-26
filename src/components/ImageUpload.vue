<template>
  <div class="image-upload">
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :headers="headers"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      accept="image/*"
    >
      <img v-if="modelValue" :src="getFullUrl(modelValue)" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <div class="upload-tip">
      <el-button v-if="modelValue" type="danger" link @click="handleRemove">
        <el-icon><Delete /></el-icon>删除图片
      </el-button>
      <span v-else>点击上传图片</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const userStore = useUserStore()

const API_BASE = import.meta.env.DEV ? '' : 'https://shicoh-api.onrender.com'

const uploadUrl = import.meta.env.DEV ? '/api/upload' : 'https://shicoh-api.onrender.com/api/upload'

// 将相对路径的图片URL转换为完整URL
const getFullUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/uploads/')) return API_BASE + url
  return url
}

const headers = computed(() => ({
  Authorization: `Bearer ${userStore.token}`
}))

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleSuccess = (response: any) => {
  if (response.code === 200) {
    emit('update:modelValue', response.data.url)
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

const handleError = () => {
  ElMessage.error('上传失败，请检查网络连接')
}

const handleRemove = () => {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.image-upload {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 178px;
  height: 178px;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
