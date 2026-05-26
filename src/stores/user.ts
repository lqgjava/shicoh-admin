import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref(Cookies.get('token') || '')
  const userInfo = ref<any>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken
    Cookies.set('token', newToken, { expires: 7 })
  }

  const setUserInfo = (info: any) => {
    userInfo.value = info
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    Cookies.remove('token')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    logout
  }
})
