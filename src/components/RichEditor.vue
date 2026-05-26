<template>
  <div class="rich-editor">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      style="height: 400px; overflow-y: hidden;"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { shallowRef, computed, onBeforeUnmount } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { useUserStore } from '@/stores/user'
import '@wangeditor/editor/dist/css/style.css'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const userStore = useUserStore()

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

// 内容 HTML
const valueHtml = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const mode = 'default'

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: []
}

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      server: import.meta.env.DEV ? '/api/upload' : 'https://shicoh-api.onrender.com/api/upload',
      fieldName: 'file',
      headers: {
        Authorization: `Bearer ${userStore.token}`
      },
      customInsert(res: any, insertFn: Function) {
        // res 即服务端的返回结果
        if (res.code === 200) {
          insertFn(res.data.url, res.data.name || '', res.data.url)
        } else {
          console.error('上传失败:', res.message)
        }
      }
    }
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

const handleChange = (editor: IDomEditor) => {
  emit('update:modelValue', editor.getHtml())
}
</script>

<style scoped>
.rich-editor {
  border: 1px solid #ccc;
  z-index: 100;
}
</style>
