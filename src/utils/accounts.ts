import storage from '@/services/storage';

export const accountsOrigin = (): string =>
    import.meta.env.VITE_ACCOUNTS_URL || 'http://localhost:5401';

export const accountsLoginUrl = (next = window.location.href): string =>
    `${accountsOrigin()}/login?next=${encodeURIComponent(next)}`;

export const accountsMyAccountUrl = (): string =>
    `${accountsOrigin()}/my-account`;

export const hasLearnSession = (): boolean =>
    Boolean(storage.checkToken && storage.checkToken());

export const requireSession = (): boolean => {
    if (hasLearnSession()) {
        return true;
    }
    window.location.assign(accountsLoginUrl());
    return false;
};
