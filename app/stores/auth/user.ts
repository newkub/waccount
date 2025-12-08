import { defineStore } from 'pinia'
import type { User } from '../../types'

interface UserState {
  user: User | null
  isLoggedIn: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isLoggedIn: false,
  }),

  actions: {
    setUser(user: User | null) {
      this.user = user
      this.isLoggedIn = !!user
    },

    logout() {
      this.user = null
      this.isLoggedIn = false
    },
  },

  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => state.isLoggedIn,
  },
})
