<template>
  <div class="company-page">
    <el-card>
      <template #header>
        <span>企业信息管理</span>
      </template>
      
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" v-loading="loading">
        <el-divider>基本信息</el-divider>
        
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入公司名称" />
        </el-form-item>
        
        <el-form-item label="企业口号" prop="slogan">
          <el-input v-model="form.slogan" placeholder="请输入企业口号" />
        </el-form-item>
        
        <el-form-item label="企业简介" prop="description">
          <RichEditor v-model="form.description" />
        </el-form-item>
        
        <el-form-item label="工厂实景图片">
          <ImageUpload v-model="form.factoryImage" />
          <div style="font-size: 12px; color: #909399; margin-top: 4px;">建议尺寸：600×400，用于企业简介区域的工厂实景展示</div>
        </el-form-item>
        
        <el-divider>联系信息</el-divider>
        
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入公司地址" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮箱" />
        </el-form-item>
        
        <el-form-item label="公司官网" prop="website">
          <el-input v-model="form.website" placeholder="请输入公司官网" />
        </el-form-item>
        
        <el-divider>企业数据</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="成立年份">
              <el-input v-model="form.founded" placeholder="如：2005" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工数量">
              <el-input v-model="form.employees" placeholder="如：2000+" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="行业经验(年)">
              <el-input-number v-model="form.stats.experience" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="覆盖国家">
              <el-input-number v-model="form.stats.countries" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年产能(万台)">
              <el-input-number v-model="form.stats.capacity" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="技术专利">
              <el-input-number v-model="form.stats.patents" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="企业荣誉">
          <div v-for="(feature, index) in form.features" :key="index" class="feature-item">
            <el-input v-model="form.features[index]" placeholder="荣誉资质">
              <template #append>
                <el-button @click="removeFeature(index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          <el-button type="primary" link @click="addFeature">
            <el-icon><Plus /></el-icon>添加荣誉
          </el-button>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存修改</el-button>
          <el-button @click="fetchData">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getCompanyInfo, updateCompanyInfo } from '@/api/content'
import RichEditor from '@/components/RichEditor.vue'
import ImageUpload from '@/components/ImageUpload.vue'

const loading = ref(false)
const submitLoading = ref(false)
const formRef = ref()

const form = reactive({
  name: '',
  slogan: '',
  description: '',
  factoryImage: '',
  founded: '',
  employees: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  stats: {
    experience: 0,
    countries: 0,
    capacity: 0,
    patents: 0
  },
  features: ['']
})

const rules = {
  name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入公司地址', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

const addFeature = () => {
  form.features.push('')
}

const removeFeature = (index: number) => {
  form.features.splice(index, 1)
}

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getCompanyInfo()
    Object.assign(form, res.data)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitLoading.value = true
      try {
        await updateCompanyInfo(form)
        ElMessage.success('保存成功')
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
.feature-item {
  margin-bottom: 10px;
}
</style>
