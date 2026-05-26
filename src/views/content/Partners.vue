<template>
  <div class="partners-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>合作伙伴管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>添加合作伙伴
          </el-button>
        </div>
      </template>
      
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column type="index" width="50" />
        <el-table-column label="Logo" width="120">
          <template #default="{ row }">
            <el-image 
              v-if="row.logo" 
              :src="getImageUrl(row.logo)" 
              style="width: 100px; height: 60px;" 
              fit="contain" 
            />
            <span v-else style="color: #909399;">无Logo</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="150" />
        <el-table-column prop="website" label="网站" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'">
              {{ row.enabled ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入合作伙伴名称" />
        </el-form-item>
        <el-form-item label="Logo">
          <ImageUpload v-model="form.logo" />
          <div style="font-size: 12px; color: #909399; margin-top: 4px;">建议尺寸：200×60，透明背景PNG</div>
        </el-form-item>
        <el-form-item label="网站" prop="website">
          <el-input v-model="form.website" placeholder="请输入网站地址，如 https://www.example.com" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
import ImageUpload from '@/components/ImageUpload.vue'

const API_BASE = import.meta.env.DEV ? '' : 'https://shicoh-api.vercel.app'

// 将相对路径的图片URL转换为完整URL
const getImageUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/uploads/')) return API_BASE + url
  return url
}

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加合作伙伴')
const submitLoading = ref(false)
const formRef = ref()
const isEdit = ref(false)
const currentId = ref('')

const form = reactive({
  name: '',
  logo: '',
  website: '',
  sort: 1,
  enabled: true
})

const rules = {
  name: [{ required: true, message: '请输入合作伙伴名称', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/partners/all')
    tableData.value = res.data || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加合作伙伴'
  Object.assign(form, {
    name: '',
    logo: '',
    website: '',
    sort: tableData.value.length + 1,
    enabled: true
  })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  dialogTitle.value = '编辑合作伙伴'
  currentId.value = row.id
  Object.assign(form, {
    name: row.name,
    logo: row.logo,
    website: row.website,
    sort: row.sort,
    enabled: row.enabled === 1
  })
  dialogVisible.value = true
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该合作伙伴吗？', '提示', { type: 'warning' })
    await request.delete(`/partners/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitLoading.value = true
      try {
        const data = {
          ...form,
          enabled: form.enabled ? 1 : 0
        }
        if (isEdit.value) {
          await request.put(`/partners/${currentId.value}`, data)
        } else {
          await request.post('/partners', data)
        }
        ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error(error)
      } finally {
        submitLoading.value = false
      }
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
