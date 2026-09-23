import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@onaeko/ui/button';
import { OnaekoAPI } from '@/api/base/config';
import { RouteURL } from '@/routes/paths';
import { requireSession } from '@/utils/accounts';

type ModuleCard = { _id?: string; id?: string; title?: string };

const formatNaira = (minor?: number) => {
    if (typeof minor !== 'number') return '';
    return `₦${(minor / 100).toLocaleString('en-NG')}`;
};

export default function CourseHome() {
    const { slug = '' } = useParams();
    const [course, setCourse] = useState<any>(null);
    const [enrolled, setEnrolled] = useState(false);
    const [enrollmentId, setEnrollmentId] = useState('');
    const [windowKey, setWindowKey] = useState<'upcoming' | 'previous'>('upcoming');
    const [modules, setModules] = useState<ModuleCard[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!requireSession()) return;
        let cancelled = false;
        (async () => {
            const [detail, mine] = await Promise.all([
                OnaekoAPI.courses.getBySlug(slug),
                OnaekoAPI.enroll.me(),
            ]);
            if (cancelled) return;
            if (detail.error) {
                setError(detail.message || 'Course not found');
                return;
            }
            setCourse(detail.data);
            const rows = mine.data?.items || mine.data || [];
            const match = (Array.isArray(rows) ? rows : []).find(
                (row: any) =>
                    row.slug === slug ||
                    row.targetId === detail.data?._id ||
                    row.courseId === detail.data?._id,
            );
            if (match && (match.status === 'ACTIVE' || match.status === 'active')) {
                setEnrolled(true);
                setEnrollmentId(match._id || match.id || '');
                const list = await OnaekoAPI.courses.modules(
                    detail.data._id || detail.data.id,
                    windowKey,
                );
                const items = list.data?.items || list.data || [];
                setModules(Array.isArray(items) ? items : []);
            } else if (match) {
                setEnrollmentId(match._id || match.id || '');
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [slug, windowKey]);

    const pay = async () => {
        if (!course) return;
        if (enrollmentId) {
            const resume = await OnaekoAPI.enroll.payment(enrollmentId);
            const url = resume.data?.authorizationUrl;
            if (url) window.location.assign(url);
            return;
        }
        const created = await OnaekoAPI.enroll.create({
            targetType: 'course',
            targetId: course._id || course.id,
        });
        const url = created.data?.authorizationUrl;
        if (url) window.location.assign(url);
        if (created.error) setError(created.message || 'Could not start payment');
    };

    if (!course) {
        return <p className="text-[#615d59]">{error || 'Loading course…'}</p>;
    }

    if (!enrolled) {
        return (
            <div className="max-w-3xl space-y-6">
                <h1 className="text-3xl font-semibold">{course.title}</h1>
                {course.hostName && <p className="text-[#615d59]">{course.hostName}</p>}
                {Array.isArray(course.outcomes) && (
                    <ul className="list-disc pl-5">
                        {course.outcomes.map((item: string) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                )}
                <p className="text-xl font-medium">{formatNaira(course.price)}</p>
                {error && <p className="text-red-700">{error}</p>}
                <div className="flex flex-wrap gap-3">
                    <Button
                        type="button"
                        className="rounded-full bg-[#f36827] hover:bg-[#c44e1a] text-white min-h-11 text-sm font-medium"
                        onClick={() => void pay()}
                    >
                        Pay {formatNaira(course.price) || ''}
                    </Button>
                    <Link to={RouteURL.scholarship(slug)}>
                        <Button type="button" variant="outline" className="rounded-sm min-h-11 border-[#e6e6e6] text-[#000000]">
                            Apply for scholarship
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold mb-4">{course.title}</h1>
            <div className="mb-4 border-b border-[#e6e6e6]">
                <div
                    role="tablist"
                    aria-label="Module window"
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
                                {key} modules
                            </button>
                        );
                    })}
                </div>
            </div>
            {modules.length === 0 && (
                <p className="text-[#615d59]">No {windowKey} modules.</p>
            )}
            <ul className="space-y-3">
                {modules.map((mod) => {
                    const id = mod._id || mod.id || '';
                    return (
                        <li key={id}>
                            <Link
                                to={RouteURL.moduleClass(slug, id)}
                                className="block rounded-2xl border border-[#e6e6e6] bg-white p-4 text-[#000000] hover:border-[#a39e98]"
                            >
                                {mod.title || 'Module'}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
