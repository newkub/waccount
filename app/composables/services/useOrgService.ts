import type { OrgDashboardLayoutResponse } from '#shared/types';

export const useOrgService = () => {
  const fetchDashboardLayout = (orgId: string) => {
    return useFetch<OrgDashboardLayoutResponse>(
      () => `/api/orgs/${orgId}/dashboard-layout`,
      {
        watch: [computed(() => orgId)],
      }
    );
  };

  return {
    fetchDashboardLayout,
  };
};
