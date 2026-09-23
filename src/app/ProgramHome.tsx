import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@onaeko/ui/button';
import { OnaekoAPI } from '@/api/base/config';
import { RouteURL } from '@/routes/paths';
import { requireSession } from '@/utils/accounts';

type EventCard = { _id?: string; id?: string; title?: string; scheduledAt?: string };

export default function ProgramHome() {
    const { slug = '' } = useParams();
    const [title, setTitle] = useState(slug);
    const [program, setProgram] = useState<any>(null);
    const [programId, setProgramId] = useState('');
    const [enrolled, setEnrolled] = useState(false);
    const [windowKey, setWindowKey] = useState<'upcoming' | 'previous'>('upcoming');
    const [events, setEvents] = useState<EventCard[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!requireSession()) return;
        let cancelled = false;
        (async () => {
            const [detail, mine] = await Promise.all([
                OnaekoAPI.programs.getBySlug(slug),
                OnaekoAPI.enroll.me(),
            ]);
            if (cancelled) return;
            if (detail.error) {
                setError(detail.message || 'Programme not found');
                setLoading(false);
                return;
            }
            const id = detail.data?._id || detail.data?.id;
            setProgram(detail.data);
            setTitle(detail.data?.title || slug);
            setProgramId(id);
            const rows = mine.data?.items || mine.data || [];
            const match = (Array.isArray(rows) ? rows : []).find(
                (row: any) =>
                    row.slug === slug ||
                    row.targetId === id ||
                    row.programId === id,
            );
            const isEnrolled = Boolean(
                match && (match.status === 'ACTIVE' || match.status === 'active'),
            );
            setEnrolled(isEnrolled);
            if (isEnrolled && id) {
                const list = await OnaekoAPI.programs.events(id, windowKey);
                if (cancelled) return;
                const items = list.data?.items || list.data || [];
                setEvents(Array.isArray(items) ? items : []);
            }
            setLoading(false);
        })();
        return () => {
            cancelled = true;
        };
    }, [slug, windowKey]);

    const enroll = async () => {
        if (!programId) return;
        const created = await OnaekoAPI.enroll.create({
            targetType: 'program',
            targetId: programId,
        });
        if (created.error) {
            setError(created.message || 'Could not enrol');
            return;
        }
        setEnrolled(true);
        const list = await OnaekoAPI.programs.events(programId, windowKey);
        const items = list.data?.items || list.data || [];
        setEvents(Array.isArray(items) ? items : []);
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-[#615d59]">
                <Link to={RouteURL.programs}>Programs</Link> / {title}
            </p>
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-semibold">{title}</h1>
                {enrolled && (
                    <Link
                        to={RouteURL.recordings(slug)}
                        className="text-sm underline underline-offset-4"
                    >
                        Watch Recordings
                    </Link>
                )}
            </div>
            {program?.hostName && <p className="text-[#615d59]">{program.hostName}</p>}
            {program?.partnerName && <p className="text-[#615d59]">{program.partnerName}</p>}
            {Array.isArray(program?.outcomes) && (
                <section>
                    <h2 className="font-semibold mb-2">Course outcomes</h2>
                    <ul className="list-disc pl-5">
                        {program.outcomes.map((item: string) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>
            )}
            {Array.isArray(program?.whoFor) && (
                <section>
                    <h2 className="font-semibold mb-2">Who this course is for</h2>
                    <ul className="list-disc pl-5">
                        {program.whoFor.map((item: string) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>
            )}
            {Array.isArray(program?.whoNotFor) && (
                <section>
                    <h2 className="font-semibold mb-2">Who this course is not for</h2>
                    <ul className="list-disc pl-5">
                        {program.whoNotFor.map((item: string) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>
            )}
            {error && <p className="text-red-700">{error}</p>}
            {loading && <p className="text-[#615d59]">Loading programme…</p>}
            {!enrolled && !loading && (
                <Button
                    type="button"
                    className="rounded-full bg-[#f36827] hover:bg-[#c44e1a] text-white min-h-11 text-sm font-medium"
                    onClick={() => void enroll()}
                >
                    Enrol this course free
                </Button>
            )}
            {enrolled && (
                <>
                    <div className="border-b border-[#e6e6e6]">
                        <div
                            role="tablist"
                            aria-label="Event window"
                            className="flex gap-4 px-1"
                        >
                            {(['upcoming', 'previous'] as const).map((key) => {
                                const selected = windowKey === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        role="tab"
                                        aria-selected={selected}
                                        onClick={() => setWindowKey(key)}
                                        className={`min-h-11 border-b-2 px-2 py-2.5 text-sm font-medium capitalize transition-colors ${
                                            selected
                                                ? 'border-[#000000] text-[#000000]'
                                                : 'border-transparent text-[#615d59] hover:text-[#31302e]'
                                        }`}
                                    >
                                        {key === 'upcoming'
                                            ? 'Upcoming events'
                                            : 'View previous events'}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {!loading && events.length === 0 && (
                        <p className="text-[#615d59]">No {windowKey} events.</p>
                    )}
                    <ul className="space-y-3">
                        {events.map((event) => {
                            const id = event._id || event.id || '';
                            return (
                                <li key={id}>
                                    <Link
                                        to={RouteURL.eventClass(slug, id)}
                                        className="block rounded-2xl border border-[#e6e6e6] bg-white p-4 text-[#000000] hover:border-[#a39e98]"
                                    >
                                        {event.title || 'Event'}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
}
