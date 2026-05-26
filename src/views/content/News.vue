<template>
  <div class="news-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>新闻管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>发布新闻
          </el-button>
        </div>
      </template>
      
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column type="index" width="50" />
        <el-table-column label="图片" width="120">
          <template #default="{ row }">
            <el-image :src="getImageUrl(row.image)" style="width: 100px; height: 60px;" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeType(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="views" label="浏览量" width="100" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入新闻标题" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%;">
            <el-option label="公司新闻" value="company" />
            <el-option label="行业资讯" value="industry" />
            <el-option label="新品发布" value="product" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期" style="width: 100%;" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <RichEditor v-model="form.content" />
        </el-form-item>
        <el-form-item label="封面图">
          <ImageUpload v-model="form.image" />
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
import { getNews, createNews, updateNews, deleteNews } from '@/api/content'
import ImageUpload from '@/components/ImageUpload.vue'
import RichEditor from '@/components/RichEditor.vue'

const API_BASE = import.meta.env.DEV ? '' : 'https://shicoh-api.onrender.com'

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
const dialogTitle = ref('发布新闻')
const submitLoading = ref(false)
const formRef = ref()
const isEdit = ref(false)
const currentId = ref('')

const form = reactive({
  title: '',
  type: 'company',
  date: '',
  summary: '',
  content: '',
  image: '/assets/images/placeholder.svg'
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  summary: [{ required: true, message: '请输入摘要', trigger: 'blur' }]
}

const typeMap: Record<string, { label: string; type: string }> = {
  company: { label: '公司新闻', type: 'primary' },
  industry: { label: '行业资讯', type: 'warning' },
  product: { label: '新品发布', type: 'success' }
}

const getTypeLabel = (type: string) => typeMap[type]?.label || type
const getTypeType = (type: string) => typeMap[type]?.type || ''

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getNews()
    tableData.value = res.data || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '发布新闻'
  Object.assign(form, {
    title: '',
    type: 'company',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    content: '',
    image: '/assets/images/placeholder.svg'
  })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  dialogTitle.value = '编辑新闻'
  currentId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该新闻吗？', '提示', { type: 'warning' })
    await deleteNews(row.id)
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
        if (isEdit.value) {
          await updateNews(currentId.value, form)
        } else {
          await createNews(form)
        }
        ElMessage.success(isEdit.value ? '更新成功' : '发布成功')
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
