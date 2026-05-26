import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 根据环境动态设置 baseURL
// 开发环境：/api 会被 Vite 代理转发到 http://localhost:3002
// 生产环境：直接请求 Render 上的 API 服务器
const baseURL = import.meta.env.DEV ? '/api' : 'https://shicoh-api.onrender.com/api'

// 创建 axios 实例
const request = axios.create({
  baseURL,
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== 200) {
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message))
    }
    return data
  },
  (error) => {
    const { response } = error
    if (response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/login'
    }
    // 网络错误时提供更友好的提示
    if (!response) {
      ElMessage.error('无法连接到服务器，请确保后端服务已启动 (npm run dev in shicoh-api)')
    } else {
      ElMessage.error(response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default request

// 模拟数据（用于演示，当后端未启动时使用）
export const mockData = {
  products: [
    {
      id: '1',
      name: '直流无刷电机',
      category: 'brushless',
      description: '高效节能、低噪音、长寿命，适用于智能家居、工业自动化设备等场景。',
      tags: ['高效节能', '低噪音', '长寿命'],
      image: '/assets/images/placeholder.svg'
    },
    {
      id: '2',
      name: '步进电机',
      category: 'stepper',
      description: '高精度、高扭矩、响应快，广泛应用于3D打印、数控机床、机器人等领域。',
      tags: ['高精度', '高扭矩', '响应快'],
      image: '/assets/images/placeholder.svg'
    },
    {
      id: '3',
      name: '伺服电机',
      category: 'servo',
      description: '高动态响应、精准定位，适用于高端自动化生产线、新能源汽车配套设备。',
      tags: ['动态响应', '精准定位', '高性能'],
      image: '/assets/images/placeholder.svg'
    }
  ],
  banners: [
    {
      id: '1',
      title: '创新驱动 精工制造',
      subtitle: '新思考电机专注于各类微特电机的研发、生产与销售',
      image: '/assets/images/banner.svg',
      link: '#about',
      sort: 1
    },
    {
      id: '2',
      title: '智能制造 引领未来',
      subtitle: '拥有全自动化生产线和智能检测系统',
      image: '/assets/images/banner.svg',
      link: '#products',
      sort: 2
    }
  ],
  news: [
    {
      id: '1',
      title: '新思考电机荣获"2026年度智能制造示范企业"称号',
      summary: '近日，新思考电机凭借先进的智能制造体系和卓越的产品质量...',
      type: 'company',
      image: '/assets/images/placeholder.svg',
      date: '2026-03-15',
      views: 1286
    },
    {
      id: '2',
      title: '新思考电机新品发布：高效节能伺服电机系列正式上市',
      summary: '2月28日，新思考电机新品发布会在总部举行...',
      type: 'product',
      image: '/assets/images/placeholder.svg',
      date: '2026-02-28',
      views: 2450
    }
  ],
  company: {
    name: '新思考电机股份有限公司',
    slogan: '创新驱动 精工制造',
    description: '新思考电机专注于各类微特电机的研发、生产与销售，为全球客户提供高品质的电机解决方案。',
    founded: '2005',
    employees: '2000+',
    address: '江苏省苏州市工业园区智能制造产业园88号',
    phone: '400-888-8888',
    email: 'info@xinsikao-motor.com',
    website: 'www.xinsikao-motor.com',
    stats: {
      experience: 21,
      countries: 50,
      capacity: 5000,
      patents: 200
    },
    features: [
      '国家级高新技术企业',
      'ISO9001质量体系认证',
      'IATF16949汽车认证',
      '200+技术专利'
    ]
  }
}
