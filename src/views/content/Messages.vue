<template>
  <div class="messages-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>留言管理</span>
          <el-radio-group v-model="filterStatus" @change="handleFilterChange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="pending">待处理</el-radio-button>
            <el-radio-button label="processing">处理中</el-radio-button>
            <el-radio-button label="resolved">已解决</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      
      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="subject" label="咨询主题" width="100" />
        <el-table-column prop="content" label="留言内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="90" />
        <el-table-column prop="created_at" label="提交时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="success" link @click="handleReply(row)">回复</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 查看对话框 -->
    <el-dialog v-model="dialogVisible" title="留言详情" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="姓名">{{ currentMessage.name }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ currentMessage.phone }}</el-descriptions-item>
        <el-descriptions-item label="留言内容">{{ currentMessage.content }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false)
const tableData = ref([])
const filterStatus = ref('')
const dialogVisible = ref(false)
const currentMessage = ref<any>({})

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/messages')
    tableData.value = res.data?.list || []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleFilterChange = () => {
  fetchData()
}

const handleView = (row: any) => {
  currentMessage.value = { ...row }
  dialogVisible.value = true
}

const handleReply = (row: any) => {
  // 回复功能
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该留言吗？', '提示', { type: 'warning' })
    await request.delete(`/messages/${row.id}`)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    console.error(error)
  }
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
