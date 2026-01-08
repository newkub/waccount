import type { ModuleOptions } from './types'

export interface ModuleOptions {
  /**
   * Public pages that don't require authentication
   * @default []
   */
  publicPages?: string[]

  /**
   * Custom navigation items
   */
  navItems?: NavItem[]

  /**
   * Enable/disable auth middleware
   * @default true
   */
  enableAuthMiddleware?: boolean

  /**
   * Login page path
   * @default '/auth/login'
   */
  loginPath?: string
}

export interface NavItem {
  id: string
  label: string
  icon?: string
  path: string
  badge?: string | number
  disabled?: boolean
}

export interface AuthDashboardConfig {
  publicPages: string[]
  navItems: NavItem[]
  enableAuthMiddleware: boolean
  loginPath: string
}
