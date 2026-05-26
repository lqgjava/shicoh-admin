<template>
  <div class="banners-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>轮播图管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>添加轮播图
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
        <el-table-column prop="title" label="标题" min-width="150" />
        <el-table-column prop="subtitle" label="副标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="link" label="链接" width="120" />
        <el-table-column prop="sort" label="排序" width="80" />
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="form.subtitle" type="textarea" :rows="2" placeholder="请输入副标题" />
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入链接，如 #about" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="图片">
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
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/api/content'
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
const dialogTitle = ref('添加轮播图')
const submitLoading = ref(false)
const formRef = ref()
const isEdit = ref(false)
const currentId = ref('')

const form = reactive({
  title: '',
  subtitle: '',
  image: '/assets/images/banner.svg',
  link: '#',
  sort: 1
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  subtitle: [{ required: true, message: '请输入副标题', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getBanners()
    tableData.value = res.data || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加轮播图'
  Object.assign(form, {
    title: '',
    subtitle: '',
    image: '/assets/images/banner.svg',
    link: '#',
    sort: tableData.value.length + 1
  })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  dialogTitle.value = '编辑轮播图'
  currentId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该轮播图吗？', '提示', { type: 'warning' })
    await deleteBanner(row.id)
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
          await updateBanner(currentId.value, form)
        } else {
          await createBanner(form)
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
