# Problems & Solutions

This document outlines the key problems identified during the project analysis and the solutions implemented to address them.

## 1. Code Duplication and Complexity

- **Problem**: Many components and composables contained significant boilerplate and duplicated logic, especially for API calls (loading, error, success states) and form handling. This made the codebase hard to read, maintain, and test.
  - `useAuth.ts` and `useUserManagement.ts` had large, repetitive `try-catch-finally` blocks for every API interaction.
  - `ProfileForm.vue` and `RegisterForm.vue` mixed form state management, validation, and submission logic directly within the component.
  - Pages like `settings.vue` and `[account]/index.vue` were monolithic, containing multiple distinct sections of UI and logic in a single file.

- **Solution**: Implemented a more modular, composable-driven architecture.
  - **Created `useApiHandler.ts`**: A generic composable to abstract away the boilerplate of handling API calls. It manages loading, error, and success states centrally.
  - **Broke Down Composables**: Refactored `useAuth.ts` into smaller, focused composables (`useUserState`, `useAuthActions`) and applied the `useApiHandler` to `useUserManagement.ts`.
  - **Extracted Form Logic**: Created `useProfileForm.ts` and `useRegisterForm.ts` to encapsulate all logic related to form state, validation, and submission, leaving the Vue components to focus solely on presentation.
  - **Component Decomposition**: Broke down large page components (`settings.vue`, `[account]/index.vue`) and complex components (`AuthUI.vue`, `AccountSidebar.vue`) into smaller, single-responsibility components (e.g., `SettingsSection`, `ProfileHeader`, `AuthTabs`).

## 2. Inconsistent Server-Side Logic

- **Problem**: Server-side utility functions and API endpoints had inconsistent error handling and duplicated helper functions (`callWorkOS`). Some endpoints (`/api/auth/user`) were redundant or used outdated session logic.

- **Solution**: Standardized server-side logic.
  - **Centralized API Helper**: Created a single `server/utils/api.ts` to house the `callWorkOS` helper function, ensuring all WorkOS API interactions are handled uniformly.
  - **Refactored Utils & Endpoints**: Updated all files in `server/utils` and `server/api` to use the shared helper, simplifying their structure.
  - **Created Cookie Helpers**: Added `setAuthCookies` and `clearAuthCookies` to `server/utils/auth.ts` to standardize session management.
  - **Removed Redundant Code**: Deleted the unused `/api/auth/user.get.ts` endpoint.

## 3. Linter False Positives with Vue Template Usage

- **Problem**: The Biome linter consistently failed to detect the usage of variables and functions from the `<script setup>` block within the `<template>`, leading to a large number of `noUnusedVariables` warnings that were incorrect.

- **Solution**: Acknowledged the linter's limitation. For variables and functions that were confirmed to be in use within the template, the linter warnings were ignored to avoid breaking the components. The focus was shifted to fixing legitimate issues.
