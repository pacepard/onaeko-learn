import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OnaekoAPI } from '@/api/base/config';
import { RouteURL } from '@/routes/paths';
import { requireSession } from '@/utils/accounts';
import EnrollmentTabs, {
    type EnrollmentTab,
} from '@/components/learn/EnrollmentTabs';
import { academy } from '@/styles/academy-ui';

type EnrollmentCard = {
    enrollmentId?: string;
    title?: string;
    slug?: string;
    targetType?: string;
    status?: string;
    partnerName?: string;
    description?: string;
    tags?: string[];
    nextSession?: { title?: string; startsAt?: string } | null;
};

type RecommendedCard = {
    title?: string;
    tags?: string[];
    date?: string;
    publishedAt?: string;
    slug?: string;
    targetType?: string;
    partnerName?: string;
};

const dayGreeting = (name: string) => {
    const hour = new Date().getHours();
    const part =
        hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return `${part}, ${name}`;
};

const formatDate = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

export default function Dashboard() {
    const [tab, setTab] = useState<EnrollmentTab>('ongoing');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [name, setName] = useState('there');
    const [ongoing, setOngoing] = useState<EnrollmentCard[]>([]);
    const [completed, setCompleted] = useState<EnrollmentCard[]>([]);
    const [recommended, setRecommended] = useState<RecommendedCard[]>([]);

    useEffect(() => {
        if (!requireSession()) {
            return;
        }
        let cancelled = false;
        (async () => {
            const [user, dash, rec] = await Promise.all([
                OnaekoAPI.user.getUser(),
                OnaekoAPI.enroll.dashboard(),
                OnaekoAPI.enroll.recommended(),
            ]);
            if (cancelled) return;
            if (!user.error && user.data) {
                const first = user.data.firstName || '';
                const last = user.data.lastName || '';
                setName(`${first} ${last}`.trim() || dash.data?.name || 'there');
            } else if (dash.data?.name) {
                setName(dash.data.name);
            }
            if (dash.error) {
                setError(dash.message || 'Could not load enrollments');
            } else {
                setOngoing(dash.data?.ongoing || dash.data?.enrollments || []);
                setCompleted(dash.data?.completed || []);
            }
            if (!rec.error) {
                const rows = rec.data?.items || rec.data || [];
                setRecommended(Array.isArray(rows) ? rows : []);
            }
            setLoading(false);
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const cards = tab === 'ongoing' ? ongoing : completed;
    const hrefFor = (card: EnrollmentCard) =>
        card.targetType === 'course'
            ? RouteURL.courseHome(card.slug || '')
            : RouteURL.programHome(card.slug || '');

    return (
        <div className="mx-auto w-full max-w-6xl space-y-8">
            <header className="flex flex-col gap-4 border-b border-[#e6e6e6] pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <h1 className="text-[26px] font-bold tracking-[-0.625px] text-[#000000] lg:text-[40px] lg:tracking-[-1px]">
                        {dayGreeting(name)}
                    </h1>
                    <p className="text-[15px] leading-snug text-[#615d59]">
                        Welcome to Onaeko. See your progress here.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#615d59]">
                    <span>Resources</span>
                    <span className="text-[#e6e6e6]">|</span>
                    <span>badges</span>
                </div>
            </header>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <section
                    className="space-y-4"
                    aria-labelledby="enrollments-heading"
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2
                            id="enrollments-heading"
                            className="text-lg font-semibold tracking-[-0.125px] text-[#000000]"
                        >
                            Your Enrollments
                        </h2>
                        <EnrollmentTabs value={tab} onValueChange={setTab} />
                    </div>

                    <div
                        role="tabpanel"
                        aria-labelledby={`enroll-tab-${tab}`}
                        className="min-h-[200px]"
                    >
                        {loading && (
                            <p className="py-10 text-center text-sm text-[#615d59]">
                                Loading enrollments…
                            </p>
                        )}
                        {error && (
                            <p className="py-10 text-center text-sm text-red-700">
                                {error}
                            </p>
                        )}
                        {!loading && !error && cards.length === 0 && (
                            <div
                                className={`${academy.card} flex min-h-[200px] flex-col items-center justify-center gap-2 border-dashed px-6 py-10 text-center`}
                                role="status"
                            >
                                <p className="text-base font-medium text-[#31302e]">
                                    No {tab} enrollments
                                </p>
                                <p className="max-w-sm text-sm text-[#615d59]">
                                    {tab === 'ongoing'
                                        ? 'Enrol in a programme or course to see it here.'
                                        : 'Completed learning will show up in this tab.'}
                                </p>
                            </div>
                        )}
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {cards.map((card, i) => (
                                <li key={`${card.slug || card.enrollmentId || i}`}>
                                    <Link
                                        to={hrefFor(card)}
                                        className={`${academy.card} flex h-full min-h-11 flex-col gap-2 p-4 transition-colors hover:border-[#a39e98]`}
                                    >
                                        <p className="text-base font-semibold leading-snug text-[#000000]">
                                            {card.title || card.slug}
                                        </p>
                                        {card.partnerName && (
                                            <p className="text-sm text-[#615d59]">
                                                {card.partnerName}
                                            </p>
                                        )}
                                        {card.description && (
                                            <p className="line-clamp-2 text-sm text-[#31302e]">
                                                {card.description}
                                            </p>
                                        )}
                                        {card.nextSession?.startsAt && (
                                            <p className="text-sm text-[#615d59]">
                                                Next:{' '}
                                                {card.nextSession.title || 'Session'}{' '}
                                                · {formatDate(card.nextSession.startsAt)}
                                            </p>
                                        )}
                                        {Array.isArray(card.tags) &&
                                            card.tags.length > 0 && (
                                                <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                                                    {card.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="rounded-full border border-[#e6e6e6] px-2.5 py-0.5 text-xs font-medium text-[#f36827]"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <aside
                    className="space-y-4"
                    aria-labelledby="recommended-heading"
                >
                    <h2
                        id="recommended-heading"
                        className="text-lg font-semibold tracking-[-0.125px] text-[#000000]"
                    >
                        Recommended for you
                    </h2>
                    {recommended.length === 0 && (
                        <div
                            className={`${academy.card} flex min-h-[160px] flex-col items-center justify-center gap-2 border-dashed px-4 py-8 text-center`}
                            role="status"
                        >
                            <p className="text-sm text-[#615d59]">
                                No recommendations yet.
                            </p>
                        </div>
                    )}
                    <ul className="space-y-3">
                        {recommended.map((item, i) => (
                            <li key={`${item.slug || i}`}>
                                <Link
                                    to={
                                        item.targetType === 'course'
                                            ? RouteURL.courseHome(item.slug || '')
                                            : RouteURL.programHome(item.slug || '')
                                    }
                                    className={`${academy.card} block p-4 transition-colors hover:border-[#a39e98]`}
                                >
                                    <p className="font-semibold text-[#000000]">
                                        {item.title}
                                    </p>
                                    {Array.isArray(item.tags) &&
                                        item.tags.length > 0 && (
                                            <p className="mt-1 text-sm text-[#615d59]">
                                                {item.tags.join(', ')}
                                            </p>
                                        )}
                                    {(item.date || item.publishedAt) && (
                                        <p className="mt-2 text-sm text-[#615d59]">
                                            {formatDate(item.date || item.publishedAt)}
                                        </p>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
}
