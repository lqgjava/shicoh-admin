<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-icon" style="background: #409EFF;">
            <el-icon size="32" color="#fff"><View /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.views }}</div>
            <div class="stat-label">今日访问量</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-icon" style="background: #67C23A;">
            <el-icon size="32" color="#fff"><Goods /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.products }}</div>
            <div class="stat-label">产品数量</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-icon" style="background: #E6A23C;">
            <el-icon size="32" color="#fff"><Document /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.news }}</div>
            <div class="stat-label">新闻数量</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card" @click="$router.push('/messages')" style="cursor: pointer;">
          <div class="stat-icon" style="background: #F56C6C;">
            <el-icon size="32" color="#fff"><Message /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingMessages }}</div>
            <div class="stat-label">待处理留言</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>快速操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/products')">
              <el-icon><Plus /></el-icon>添加产品
            </el-button>
            <el-button type="success" @click="$router.push('/news')">
              <el-icon><Plus /></el-icon>发布新闻
            </el-button>
            <el-button type="warning" @click="$router.push('/banners')">
              <el-icon><Edit /></el-icon>修改轮播图
            </el-button>
            <el-button type="info" @click="$router.push('/company')">
              <el-icon><Edit /></el-icon>编辑企业信息
            </el-button>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>系统信息</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="最后更新">2026-05-22</el-descriptions-item>
            <el-descriptions-item label="登录用户">{{ userStore.userInfo?.username || 'admin' }}</el-descriptions-item>
            <el-descriptions-item label="产品分类">{{ stats.categories }} 个</el-descriptions-item>
            <el-descriptions-item label="产品标签">{{ stats.tags }} 个</el-descriptions-item>
            <el-descriptions-item label="新闻类型">{{ stats.newsTypes }} 个</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'

const userStore = useUserStore()

const stats = ref({
  views: 0,
  products: 0,
  news: 0,
  pendingMessages: 0,
  categories: 0,
  tags: 0,
  newsTypes: 0
})

const fetchStats = async () => {
  try {
    // 获取产品数量
    const productsRes: any = await request.get('/products/all')
    stats.value.products = productsRes.data?.length || 0
    
    // 获取新闻数量
    const newsRes: any = await request.get('/news/all')
    stats.value.news = newsRes.data?.length || 0
    
    // 获取待处理留言数量
    const messagesRes: any = await request.get('/messages/pending-count')
    stats.value.pendingMessages = messagesRes.data?.count || 0
    
    // 获取产品分类数量
    const categoriesRes: any = await request.get('/categories')
    stats.value.categories = categoriesRes.data?.length || 0
    
    // 获取产品标签数量
    const tagsRes: any = await request.get('/tags')
    stats.value.tags = tagsRes.data?.length || 0
    
    // 获取新闻类型数量
    const newsTypesRes: any = await request.get('/news-types')
    stats.value.newsTypes = newsTypesRes.data?.length || 0
    
    // 模拟访问量（后续可以接入真实的访问统计）
    stats.value.views = Math.floor(Math.random() * 1000) + 500
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quick-actions .el-button {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
