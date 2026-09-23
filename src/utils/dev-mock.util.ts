/**
 * P083 local mock UI rail — developer click-through only.
 * Never counts as Done for other prompts. Fail closed outside local + explicit flag.
 *
 * Keep imports relative (no `@/`) so `tsx --test` can load this module.
 */

export const DEV_MOCK_TOKEN = 'dev-mock-token';

type MockCallParams = {
    method?: string;
    path?: string;
    payload?: unknown;
    type?: string;
    isAuth?: boolean;
};

export type MockApiResponse = {
    error: boolean;
    errors: unknown[];
    data: unknown;
    message: string;
    status: number;
};

/** Pure gate — unit-tested. Staging/prod ignore the flag even if set. */
export function isUseMocksEnabled(
    environment: string | undefined,
    useMocksFlag: string | undefined,
): boolean {
    return environment === 'local' && useMocksFlag === 'true';
}

export const USE_MOCKS = isUseMocksEnabled(
    import.meta.env?.VITE_ENVIRONMENT,
    import.meta.env?.VITE_USE_MOCKS,
);

export function ok(
    data: unknown,
    message = 'Request completed successfully',
): MockApiResponse {
    return { error: false, errors: [], data, message, status: 200 };
}

export function fail(
    status: number,
    message: string,
    errors: string[] = [message],
): MockApiResponse {
    return { error: true, errors, data: {}, message, status };
}

const PROGRAM = {
    _id: 'prog-ai-education',
    id: 'prog-ai-education',
    slug: 'ai-education',
    title: 'Project: AI Education for everyone',
    description: 'Free programme sample for local mock rail.',
    hostName: 'Damola Oladipo',
    partnerName: 'Onaeko',
    outcomes: ['Understand AI foundations', 'Apply tools to real work'],
    whoFor: ['Builders exploring AI'],
    whoNotFor: ['People seeking certification only'],
    faculty: [
        { name: 'Fareed', title: 'Faculty (QA placeholder)' },
        { name: 'Casey Winters', title: 'Faculty (QA placeholder)' },
    ],
    status: 'published',
};

const COURSE = {
    _id: 'course-growth-engineering',
    id: 'course-growth-engineering',
    slug: 'growth-engineering',
    title: 'Growth Engineering',
    description: 'Paid course sample for local mock rail.',
    price: 15000000,
    scholarshipPrice: 5000000,
    currency: 'NGN',
    status: 'published',
};

const opensAtIso = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 20);
    return d.toISOString();
};

const sessionCards = () => ({
    upcoming: [
        {
            _id: 'evt-upcoming-1',
            title: 'Kickoff live class',
            startsAt: opensAtIso(),
            timezone: 'Africa/Lagos',
            hosts: ['Damola Oladipo', 'Maximus Oluwalola'],
            venue: 'Zoom',
        },
    ],
    previous: [
        {
            _id: 'evt-past-1',
            title: 'Orientation',
            startsAt: '2026-01-10T15:00:00.000Z',
            timezone: 'Africa/Lagos',
            hosts: ['Damola Oladipo'],
            venue: 'Zoom',
            recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
    ],
});

const wantMockJoin = (): boolean => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('mockJoin') === '1';
};

/**
 * Plant a fake session so Learn layouts do not bounce to Accounts.
 * Uses localStorage directly (storage has no setToken). Only when USE_MOCKS.
 */
export function ensureMockSession(): void {
    if (!USE_MOCKS || typeof localStorage === 'undefined') {
        return;
    }
    if (!localStorage.getItem('token')) {
        localStorage.setItem('token', DEV_MOCK_TOKEN);
        localStorage.setItem('userId', 'mock-user-damola');
        localStorage.setItem('role', 'user');
        localStorage.setItem('userType', 'user');
        localStorage.setItem('userEmail', 'damola@example.invalid');
    }
}

export async function mockCall(params: MockCallParams): Promise<MockApiResponse> {
    const method = (params.method || 'GET').toUpperCase();
    const path = params.path || '';
    const payload = (params.payload || {}) as Record<string, unknown>;

    console.log(`[MOCK] ${method} ${path}`);

    if (method === 'GET' && (path === '/user' || path === '/user/' || path.startsWith('/user/'))) {
        return ok({
            _id: 'mock-user-damola',
            firstName: 'Damola',
            lastName: 'Oladipo',
            email: 'damola@example.invalid',
        });
    }

    if (
        method === 'POST' &&
        (path.includes('/auth/login') ||
            path.includes('/auth/register') ||
            path.includes('/auth/verify-otp') ||
            path.includes('/auth/activate'))
    ) {
        return ok({
            token: DEV_MOCK_TOKEN,
            _id: 'mock-user-damola',
            userType: 'user',
            email: 'damola@example.invalid',
        });
    }

    if (method === 'GET' && path === '/programs/') {
        return ok({ items: [PROGRAM], programs: [PROGRAM] });
    }

    if (method === 'GET' && path.includes('/programs/slug/')) {
        return ok(PROGRAM);
    }

    if (method === 'GET' && /\/programs\/[^/]+\/events/.test(path) && path.includes('window=')) {
        return ok(sessionCards());
    }

    if (method === 'GET' && /\/events\/[^/]+\/join$/.test(path)) {
        if (wantMockJoin()) {
            return ok({ meetingUrl: 'https://zoom.us/j/mock' });
        }
        return {
            ...fail(403, 'Join opens 15 minutes before start', [
                'Join window not open',
            ]),
            data: { opensAt: opensAtIso() },
        };
    }

    if (method === 'GET' && /\/events\/[^/]+\/calendar$/.test(path)) {
        return ok({
            googleUrl:
                'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Kickoff&ctz=Africa%2FLagos',
            ics: 'BEGIN:VCALENDAR\nEND:VCALENDAR',
            title: 'Kickoff live class',
            timezone: 'Africa/Lagos',
        });
    }

    if (method === 'GET' && /\/events\/[^/]+$/.test(path)) {
        return ok({
            ...sessionCards().previous[0],
            recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        });
    }

    if (method === 'GET' && path === '/courses/') {
        return ok({ items: [COURSE], courses: [COURSE] });
    }

    if (method === 'GET' && path.includes('/courses/slug/')) {
        return ok(COURSE);
    }

    if (method === 'GET' && /\/courses\/[^/]+\/modules/.test(path) && path.includes('window=')) {
        return ok({
            upcoming: [
                {
                    _id: 'mod-upcoming-1',
                    title: 'Module 01 live',
                    startsAt: opensAtIso(),
                    timezone: 'Africa/Lagos',
                    hosts: ['Damola Oladipo'],
                    venue: 'Zoom',
                    resources: [{ title: 'Slides', url: 'https://example.invalid/slides' }],
                },
            ],
            previous: [
                {
                    _id: 'mod-past-1',
                    title: 'Module 00',
                    startsAt: '2026-01-05T15:00:00.000Z',
                    timezone: 'Africa/Lagos',
                    recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                },
            ],
        });
    }

    if (method === 'GET' && /\/modules\/[^/]+\/join$/.test(path)) {
        if (wantMockJoin()) {
            return ok({ meetingUrl: 'https://zoom.us/j/mock' });
        }
        return {
            ...fail(403, 'Join opens 15 minutes before start'),
            data: { opensAt: opensAtIso() },
        };
    }

    if (method === 'GET' && /\/modules\/[^/]+\/calendar$/.test(path)) {
        return ok({
            googleUrl:
                'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Module&ctz=Africa%2FLagos',
            ics: 'BEGIN:VCALENDAR\nEND:VCALENDAR',
            title: 'Module 01 live',
            timezone: 'Africa/Lagos',
        });
    }

    if (method === 'GET' && path.includes('/enroll/me/dashboard')) {
        return ok({
            ongoing: [
                {
                    title: PROGRAM.title,
                    slug: PROGRAM.slug,
                    targetType: 'program',
                    status: 'ACTIVE',
                },
                {
                    title: COURSE.title,
                    slug: COURSE.slug,
                    targetType: 'course',
                    status: 'PENDING',
                },
            ],
            completed: [],
            nextSession: sessionCards().upcoming[0],
        });
    }

    if (method === 'GET' && path.includes('/enroll/recommended')) {
        return ok({
            items: [
                {
                    title: COURSE.title,
                    slug: COURSE.slug,
                    targetType: 'course',
                    tags: ['growth', 'engineering'],
                    date: '2026-09-20',
                },
                {
                    title: PROGRAM.title,
                    slug: PROGRAM.slug,
                    targetType: 'program',
                    tags: ['ai', 'education'],
                    date: '2026-09-15',
                },
            ],
        });
    }

    if (method === 'GET' && path === '/enroll/me') {
        return ok({
            items: [
                {
                    targetType: 'program',
                    targetId: PROGRAM._id,
                    status: 'ACTIVE',
                    slug: PROGRAM.slug,
                    title: PROGRAM.title,
                },
                {
                    targetType: 'course',
                    targetId: COURSE._id,
                    status: 'PENDING',
                    slug: COURSE.slug,
                    title: COURSE.title,
                },
            ],
        });
    }

    if (method === 'GET' && path.includes('/payment')) {
        return ok({
            authorizationUrl: 'https://example.invalid/paystack-mock',
        });
    }

    if (method === 'POST' && path === '/enroll/') {
        const targetType = payload.targetType;
        if (targetType === 'program') {
            return ok({
                status: 'ACTIVE',
                targetType: 'program',
                targetId: payload.targetId,
            });
        }
        return ok({
            status: 'PENDING',
            targetType: 'course',
            targetId: payload.targetId,
            authorizationUrl: 'https://example.invalid/paystack-mock',
        });
    }

    if (method === 'POST' && path.includes('/enroll/scholarship')) {
        return ok({ status: 'pending' });
    }

    if (method === 'GET' && path.includes('/enroll/scholarship/me')) {
        return ok({
            items: [
                {
                    courseSlug: COURSE.slug,
                    status: 'pending',
                    targetType: 'course',
                    targetId: COURSE._id,
                },
            ],
        });
    }

    if (method === 'GET' && path.includes('recordings')) {
        return ok({
            items: [
                {
                    title: 'Orientation recording',
                    recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                },
            ],
        });
    }

    if (method === 'POST' && path.includes('/auth/logout')) {
        return ok({});
    }

    console.warn(`[MOCK] unmatched path: ${method} ${path}`);
    return ok({});
}
