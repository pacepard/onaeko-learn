/**
 * Backend HTTP paths. Academy MLP uses the enroll/programs/courses keys.
 * Leftover identity keys remain so unused leftover modules still typecheck.
 */

export const ApiPath = {
    login: '/auth/login',
    register: '/auth/register',
    activate: '/auth/activate',
    verifyEmail: '/auth/verify-email',
    verifyOtp: '/auth/verify-otp',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    resendOtp: '/auth/resend-otp',
    token: '/auth/token',
    logout: '/auth/logout',
    loggedInUser: '/user/',
    continue: '/auth/continue',
    oauthGoogle: '/auth/oauth/google',
    oauthGithub: '/auth/oauth/github',
    oauthCallback: '/auth/oauth/callback',
    users: '/users',
    user: '/user/',
    talents: '/talents',
    updatePassword: '/users/update-password',
    onboardUserType: '/user/onboard/user-type',
    onboardBasicInfo: '/user/onboard/basic-info',
    onboardUserInfo: '/user/onboard/user-info',
    onboardTalentInfo: '/user/onboard/talent-info',
    onboardBusinessInfo: '/user/onboard/business-info',
    onboardComplete: '/user/onboard/complete',
    onboardStatus: '/user/onboard/status',
    account: '/account',
    profile: '/account/profile',
    security: '/account/security',
    twoFactor: '/account/security/2fa',
    sessions: '/account/sessions',
    billing: '/account/billing',
    paymentMethods: '/account/billing/payment-methods',
    invoices: '/account/billing/invoices',
    deleteAccount: '/account',
    plans: '/plans',
    subscriptions: '/subscriptions',
    transactions: '/transactions',
    workspace: '/workspace',
    storageUpload: '/storage/upload',

    programs: '/programs/',
    programSlug: (slug: string) => `/programs/slug/${slug}`,
    programById: (id: string) => `/programs/${id}`,
    programEvents: (programId: string) => `/programs/${programId}/events`,
    eventDetail: (programId: string, eventId: string) =>
        `/programs/${programId}/events/${eventId}`,
    eventJoin: (programId: string, eventId: string) =>
        `/programs/${programId}/events/${eventId}/join`,
    eventCalendar: (programId: string, eventId: string) =>
        `/programs/${programId}/events/${eventId}/calendar`,
    courses: '/courses/',
    courseSlug: (slug: string) => `/courses/slug/${slug}`,
    courseById: (id: string) => `/courses/${id}`,
    courseModules: (courseId: string) => `/courses/${courseId}/modules`,
    moduleDetail: (courseId: string, moduleId: string) =>
        `/courses/${courseId}/modules/${moduleId}`,
    moduleJoin: (courseId: string, moduleId: string) =>
        `/courses/${courseId}/modules/${moduleId}/join`,
    moduleCalendar: (courseId: string, moduleId: string) =>
        `/courses/${courseId}/modules/${moduleId}/calendar`,
    enroll: '/enroll/',
    enrollMe: '/enroll/me',
    enrollDashboard: '/enroll/me/dashboard',
    enrollRecommended: '/enroll/recommended',
    enrollPayment: (enrollmentId: string) =>
        `/enroll/me/${enrollmentId}/payment`,
    enrollOne: (targetType: string, targetId: string) =>
        `/enroll/me/${targetType}/${targetId}`,
    scholarship: '/enroll/scholarship',
    scholarshipMe: '/enroll/scholarship/me',
} as const;
