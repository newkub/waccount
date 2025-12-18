import { describe, it, expect } from 'vitest';
import { useActivity } from '~/app/composables/useActivity';

describe('useActivity', () => {
  it('should return the correct icon for a known activity type', () => {
    const { getActivityIcon } = useActivity();
    expect(getActivityIcon('user.signed_in')).toBe('i-mdi-login-variant');
    expect(getActivityIcon('email.verified')).toBe('i-mdi-email-check-outline');
  });

  it('should return a default icon for an unknown activity type', () => {
    const { getActivityIcon } = useActivity();
    expect(getActivityIcon('unknown.activity')).toBe('i-mdi-information-outline');
  });

  it('should return a default icon for an empty string', () => {
    const { getActivityIcon } = useActivity();
    expect(getActivityIcon('')).toBe('i-mdi-information-outline');
  });
});
