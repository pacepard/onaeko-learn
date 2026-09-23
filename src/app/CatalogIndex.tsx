import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OnaekoAPI } from '@/api/base/config';
import { RouteURL } from '@/routes/paths';
import { requireSession } from '@/utils/accounts';

export default function CatalogIndex({ kind }: { kind: 'program' | 'course' }) {
    const [rows, setRows] = useState<Array<{ title?: string; slug?: string; status?: string }>>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!requireSession()) return;
        let cancelled = false;
        (async () => {
            const [mine, published] = await Promise.all([
                OnaekoAPI.enroll.me(),
                kind === 'program' ? OnaekoAPI.programs.list() : OnaekoAPI.courses.list(),
            ]);
            if (cancelled) return;
            if (published.error) {
                setError(published.message || 'Could not load catalogue');
            }
            const pub = published.data?.items || published.data || [];
            const enrollments = mine.data?.items || mine.data || [];
            const list = Array.isArray(pub) ? pub : [];
            const mineList = Array.isArray(enrollments) ? enrollments : [];
            const slugs = new Set(list.map((r: { slug?: string }) => r.slug));
            mineList.forEach((row: { slug?: string; targetType?: string }) => {
                if (row.slug && row.targetType === kind && !slugs.has(row.slug)) {
                    list.push(row);
                    slugs.add(row.slug);
                }
            });
            setRows(list);
            setLoading(false);
        })();
        return () => {
            cancelled = true;
        };
    }, [kind]);

    return (
        <div>
            <h1 className="text-3xl font-semibold mb-6">
                {kind === 'program' ? 'Programs' : 'Courses'}
            </h1>
            {loading && <p className="text-[#615d59]">Loading…</p>}
            {error && <p className="text-red-700">{error}</p>}
            {!loading && rows.length === 0 && (
                <p className="text-[#615d59]">Nothing to show yet.</p>
            )}
            <ul className="grid gap-3 md:grid-cols-2">
                {rows.map((row) => (
                    <li key={row.slug}>
                        <Link
                            to={
                                kind === 'program'
                                    ? RouteURL.programHome(row.slug || '')
                                    : RouteURL.courseHome(row.slug || '')
                            }
                            className="block rounded-2xl border border-[#e6e6e6] bg-white p-4 text-[#000000] hover:border-[#a39e98] min-h-11"
                        >
                            {row.title || row.slug}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
