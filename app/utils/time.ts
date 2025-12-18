/**
 * Formats a date string into a relative time string (e.g., "2 hours ago").
 * @param {string} dateString The date string to format.
 * @returns {string} The formatted relative time string.
 */
export const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    if (seconds < 30) return 'just now';

    for (const [intervalName, intervalSeconds] of Object.entries(intervals)) {
        const count = Math.floor(seconds / intervalSeconds);
        if (count >= 1) {
            return `${count} ${intervalName}${count > 1 ? 's' : ''} ago`;
        }
    }

    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
};
