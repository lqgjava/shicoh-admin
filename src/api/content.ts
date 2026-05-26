import request, { mockData } from '@/utils/request'
import { ElMessage } from 'element-plus'

// 是否使用模拟数据（当后端未启动时）
const USE_MOCK = false

// 辅助函数：处理请求，失败时返回模拟数据
const handleRequest = async (apiCall: Promise<any>, mockReturn: any) => {
  if (!USE_MOCK) {
    return await apiCall
  }
  
  try {
    return await apiCall
  } catch (error: any) {
    // 如果是网络错误，返回模拟数据
    if (!error.response) {
      console.log('使用模拟数据:', mockReturn)
      return { code: 200, data: mockReturn }
    }
    throw error
  }
}

// 轮播图管理
export const getBanners = () => {
  return handleRequest(
    request.get('/banners/all'),
    mockData.banners
  )
}

export const createBanner = (data: any) => {
  if (USE_MOCK) {
    ElMessage.success('添加成功（演示模式）')
    return Promise.resolve({ code: 200, data })
  }
  return request.post('/banners', data)
}

export const updateBanner = (id: string, data: any) => {
  if (USE_MOCK) {
    ElMessage.success('更新成功（演示模式）')
    return Promise.resolve({ code: 200, data })
  }
  return request.put(`/banners/${id}`, data)
}

export const deleteBanner = (id: string) => {
  if (USE_MOCK) {
    ElMessage.success('删除成功（演示模式）')
    return Promise.resolve({ code: 200 })
  }
  return request.delete(`/banners/${id}`)
}

// 产品管理
export const getProducts = (params?: any) => {
  return handleRequest(
    request.get('/products', { params }),
    mockData.products
  )
}

export const createProduct = (data: any) => {
  if (USE_MOCK) {
    ElMessage.success('添加成功（演示模式）')
    return Promise.resolve({ code: 200, data: { ...data, id: Date.now().toString() } })
  }
  return request.post('/products', data)
}

export const updateProduct = (id: string, data: any) => {
  if (USE_MOCK) {
    ElMessage.success('更新成功（演示模式）')
    return Promise.resolve({ code: 200, data })
  }
  return request.put(`/products/${id}`, data)
}

export const deleteProduct = (id: string) => {
  if (USE_MOCK) {
    ElMessage.success('删除成功（演示模式）')
    return Promise.resolve({ code: 200 })
  }
  return request.delete(`/products/${id}`)
}

// 新闻管理
export const getNews = (params?: any) => {
  return handleRequest(
    request.get('/news/all', { params }),
    mockData.news
  )
}

export const createNews = (data: any) => {
  if (USE_MOCK) {
    ElMessage.success('发布成功（演示模式）')
    return Promise.resolve({ code: 200, data: { ...data, id: Date.now().toString() } })
  }
  return request.post('/news', data)
}

export const updateNews = (id: string, data: any) => {
  if (USE_MOCK) {
    ElMessage.success('更新成功（演示模式）')
    return Promise.resolve({ code: 200, data })
  }
  return request.put(`/news/${id}`, data)
}

export const deleteNews = (id: string) => {
  if (USE_MOCK) {
    ElMessage.success('删除成功（演示模式）')
    return Promise.resolve({ code: 200 })
  }
  return request.delete(`/news/${id}`)
}

// 企业信息
export const getCompanyInfo = () => {
  return handleRequest(
    request.get('/company'),
    mockData.company
  )
}

export const updateCompanyInfo = (data: any) => {
  if (USE_MOCK) {
    ElMessage.success('保存成功（演示模式）')
    return Promise.resolve({ code: 200, data })
  }
  return request.put('/company', data)
}
