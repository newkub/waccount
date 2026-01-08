# @waccount/auth-dashboard

Auth Dashboard module for Nuxt with customizable tabs.

## Features

- 🔐 Authentication middleware and composables
- 📊 Dashboard layout with sidebar and mobile menu
- 🎨 Customizable navigation tabs via slots
- ⚙️ Configurable via module options

## Installation

```bash
bun add @waccount/auth-dashboard
```

## Usage

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@waccount/auth-dashboard'],
  authDashboard: {
    publicPages: ['/', '/auth/login', '/auth/signup'],
  }
})
```

## Custom Tabs

```vue
<template>
  <AuthDashboardShell>
    <template #custom-tab>
      <YourCustomTab />
    </template>
    
    <template #default>
      <YourContent />
    </template>
  </AuthDashboardShell>
</template>
```

## License

MIT
