<template>
  <div class="news-types-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>新闻类型管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>添加类型
          </el-button>
        </div>
      </template>
      
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="类型名称" min-width="200" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="99" />
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

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加类型')
const submitLoading = ref(false)
const formRef = ref()
const isEdit = ref(false)
const currentId = ref('')

const form = reactive({
  name: '',
  sort: 1
})

const rules = {
  name: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/news-types')
    tableData.value = res.data || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加类型'
  form.name = ''
  form.sort = tableData.value.length + 1
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  dialogTitle.value = '编辑类型'
  currentId.value = row.id
  form.name = row.name
  form.sort = row.sort || 1
  dialogVisible.value = true
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该类型吗？', '提示', { type: 'warning' })
    await request.delete(`/news-types/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error: any) {
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEdit.value) {
          await request.put(`/news-types/${currentId.value}`, form)
        } else {
          await request.post('/news-types', form)
        }
        ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
        dialogVisible.value = false
        fetchData()
      } catch (error: any) {
        if (error.response?.data?.message) {
          ElMessage.error(error.response.data.message)
        }
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
