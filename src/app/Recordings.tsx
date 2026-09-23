import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OnaekoAPI } from '@/api/base/config';
import { requireSession } from '@/utils/accounts';
import { toYoutubeEmbed } from '@/utils/youtube';

type Rec = { title?: string; recordingUrl?: string };

export default function Recordings() {
    const { slug = '' } = useParams();
    const [rows, setRows] = useState<Rec[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!requireSession()) return;
        let cancelled = false;
        (async () => {
            const program = await OnaekoAPI.programs.getBySlug(slug);
            const id = program.data?._id || program.data?.id;
            if (!id) {
                setError('Programme not found');
                return;
            }
            const list = await OnaekoAPI.programs.events(id, 'previous');
            if (cancelled) return;
            const items = list.data?.items || list.data || [];
            const rows = await Promise.all(
                (Array.isArray(items) ? items : []).map(async (item: Rec & { _id?: string; id?: string }) => {
                    const eventId = item._id || item.id;
                    if (!eventId) return item;
                    const detail = await OnaekoAPI.programs.eventDetail(id, eventId);
                    return {
                        title: detail.data?.title || item.title,
                        recordingUrl: detail.data?.recordingUrl,
                    };
                }),
            );
            setRows(rows.filter((item) => item.recordingUrl));
        })();
        return () => {
            cancelled = true;
        };
    }, [slug]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold">Watch now</h1>
            {error && <p className="text-red-700">{error}</p>}
            {rows.length === 0 && !error && (
                <p className="text-[#615d59]">No recordings yet.</p>
            )}
            {rows.map((row, i) => {
                const embed = toYoutubeEmbed(row.recordingUrl);
                return (
                    <section key={i} className="space-y-2">
                        <h2 className="font-medium">{row.title}</h2>
                        {embed ? (
                            <iframe
                                title={row.title || 'Recording'}
                                src={embed}
                                className="w-full aspect-video rounded-2xl border border-[#e6e6e6] bg-white"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <a
                                href={row.recordingUrl}
                                className="underline"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Watch now
                            </a>
                        )}
                    </section>
                );
            })}
        </div>
    );
}
