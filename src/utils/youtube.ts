export const toYoutubeEmbed = (url?: string | null): string | null => {
    if (!url) {
        return null;
    }
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./, '');
        if (host === 'youtu.be') {
            const id = parsed.pathname.replace('/', '');
            return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
        }
        if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
            const id = parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
            return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
        }
    } catch {
        return null;
    }
    return null;
};
