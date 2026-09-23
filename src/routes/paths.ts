/** Browser / React Router paths for learn.onaeko.com */

const AppURL = import.meta.env?.VITE_APP_URL ?? '';

export const RouteURL = {
    home: '/',
    programs: '/programs',
    programHome: (slug: string) => `/programs/${slug}`,
    eventClass: (slug: string, eventId: string) =>
        `/programs/${slug}/events/${eventId}`,
    recordings: (slug: string) => `/programs/${slug}/recordings`,
    courses: '/courses',
    courseHome: (slug: string) => `/courses/${slug}`,
    scholarship: (slug: string) => `/courses/${slug}/scholarship`,
    moduleClass: (slug: string, moduleId: string) =>
        `/courses/${slug}/modules/${moduleId}`,
    login: '/login',
    logout: '/logout',
    myAccount: '/my-account',
    learn: '/',
    onboarding: '/__leftover/onboarding',
    onboardingBasicInfo: '/__leftover/onboarding/basic-info',
    onboardingUserInfo: '/__leftover/onboarding/user-info',
    onboardingBusinessInfo: '/__leftover/onboarding/business-info',
    onboardingCreateWorkspace: '/__leftover/onboarding/create-workspace',
    onboardingInviteTeammates: '/__leftover/onboarding/invite-teammates',
    regCallback: `${AppURL}/`,
    subCallback: `${AppURL}/`,
};

export const LEARN_ROUTE_PATHS = {
    home: '/',
    programs: '/programs',
    programHome: '/programs/:slug',
    eventClass: '/programs/:slug/events/:eventId',
    recordings: '/programs/:slug/recordings',
    courses: '/courses',
    courseHome: '/courses/:slug',
    scholarship: '/courses/:slug/scholarship',
    moduleClass: '/courses/:slug/modules/:moduleId',
} as const;
