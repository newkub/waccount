import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTimeAgo } from '~/app/utils/time';

describe('formatTimeAgo', () => {
  beforeEach(() => {
    // Lock the current time for consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-10-27T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return "just now" for times less than 30 seconds ago', () => {
    const date = new Date('2023-10-27T09:59:45Z').toISOString();
    expect(formatTimeAgo(date)).toBe('just now');
  });

  it('should format times in seconds', () => {
    const date = new Date('2023-10-27T09:59:20Z').toISOString();
    expect(formatTimeAgo(date)).toBe('40 seconds ago');
  });

  it('should format times in minutes', () => {
    const date = new Date('2023-10-27T09:58:00Z').toISOString();
    expect(formatTimeAgo(date)).toBe('2 minutes ago');
  });

  it('should format times in hours', () => {
    const date = new Date('2023-10-27T07:00:00Z').toISOString();
    expect(formatTimeAgo(date)).toBe('3 hours ago');
  });

  it('should format times in days', () => {
    const date = new Date('2023-10-25T10:00:00Z').toISOString();
    expect(formatTimeAgo(date)).toBe('2 days ago');
  });

  it('should format times in weeks', () => {
    const date = new Date('2023-10-13T10:00:00Z').toISOString();
    expect(formatTimeAgo(date)).toBe('2 weeks ago');
  });

  it('should format times in months', () => {
    const date = new Date('2023-08-27T10:00:00Z').toISOString();
    expect(formatTimeAgo(date)).toBe('2 months ago');
  });

  it('should format times in years', () => {
    const date = new Date('2021-10-27T10:00:00Z').toISOString();
    expect(formatTimeAgo(date)).toBe('2 years ago');
  });
});
