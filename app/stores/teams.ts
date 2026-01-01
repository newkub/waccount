import { defineStore } from 'pinia';
import type { Invitation, UserOrganization as Organization } from '~/shared/types';

export const useTeamsStore = defineStore('teams', () => {
  const organizations = ref<Organization[]>([]);
  const invitations = ref<Invitation[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isOrganizationAdmin = computed(() => {
    return organizations.value.some(org => org.role === 'admin');
  });

  return {
    organizations,
    invitations,
    loading,
    error,
    isOrganizationAdmin,
  };
});
