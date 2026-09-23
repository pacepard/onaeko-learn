import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@onaeko/ui/button';
import { OnaekoAPI } from '@/api/base/config';
import { requireSession } from '@/utils/accounts';
import { toYoutubeEmbed } from '@/utils/youtube';

export default function SessionClass({ kind }: { kind: 'event' | 'module' }) {
    const { slug = '', eventId = '', moduleId = '' } = useParams();
    const [title, setTitle] = useState('');
    const [joinDisabled, setJoinDisabled] = useState(true);
    const [opensAt, setOpensAt] = useState('');
    const [meetingUrl, setMeetingUrl] = useState('');
    const [calendarUrl, setCalendarUrl] = useState('');
    const [recordingUrl, setRecordingUrl] = useState('');
    const [resources, setResources] = useState<Array<{ title?: string; url?: string }>>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!requireSession()) return;
        let cancelled = false;
        (async () => {
            if (kind === 'event') {
                const program = await OnaekoAPI.programs.getBySlug(slug);
                const programId = program.data?._id || program.data?.id;
                if (!programId) {
                    setError('Programme not found');
                    return;
                }
                const [detail, join, calendar] = await Promise.all([
                    OnaekoAPI.programs.eventDetail(programId, eventId),
                    OnaekoAPI.programs.join(programId, eventId),
                    OnaekoAPI.programs.calendar(programId, eventId),
                ]);
                if (cancelled) return;
                setTitle(detail.data?.title || 'Class');
                setRecordingUrl(detail.data?.recordingUrl || '');
                if (join.error) {
                    setJoinDisabled(true);
                    setOpensAt(join.data?.opensAt || join.message || '');
                } else {
                    setJoinDisabled(false);
                    setMeetingUrl(join.data?.meetingUrl || '');
                }
                setCalendarUrl(calendar.data?.googleUrl || '');
            } else {
                const course = await OnaekoAPI.courses.getBySlug(slug);
                const courseId = course.data?._id || course.data?.id;
                if (!courseId) {
                    setError('Course not found');
                    return;
                }
                const [detail, join, calendar] = await Promise.all([
                    OnaekoAPI.courses.moduleDetail(courseId, moduleId),
                    OnaekoAPI.courses.join(courseId, moduleId),
                    OnaekoAPI.courses.calendar(courseId, moduleId),
                ]);
                if (cancelled) return;
                setTitle(detail.data?.title || 'Module');
                setRecordingUrl(detail.data?.recording?.url || detail.data?.recordingUrl || '');
                setResources(detail.data?.resources || []);
                if (join.error) {
                    setJoinDisabled(true);
                    setOpensAt(join.data?.opensAt || join.message || '');
                } else {
                    setJoinDisabled(false);
                    setMeetingUrl(join.data?.meetingUrl || '');
                }
                setCalendarUrl(calendar.data?.googleUrl || '');
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [kind, slug, eventId, moduleId]);

    const embed = toYoutubeEmbed(recordingUrl);
    const copyEvent = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch {
            window.prompt('Copy event link', window.location.href);
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <h1 className="text-3xl font-semibold">{title}</h1>
            {error && <p className="text-red-700">{error}</p>}
            <div className="flex flex-wrap gap-3">
                <Button
                    type="button"
                    disabled={joinDisabled}
                    className="rounded-full bg-[#f36827] hover:bg-[#c44e1a] text-white min-h-11 text-sm font-medium"
                    onClick={() => meetingUrl && window.open(meetingUrl, '_blank')}
                >
                    Join Live Zoom Class
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="rounded-sm min-h-11 border-[#e6e6e6] text-[#000000]"
                    onClick={() => calendarUrl && window.open(calendarUrl, '_blank')}
                >
                    Add to Calendar
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    className="rounded-sm min-h-11 border-[#e6e6e6] text-[#000000]"
                    onClick={() => void copyEvent()}
                >
                    Copy event
                </Button>
            </div>
            {joinDisabled && (
                <p className="text-sm text-[#615d59]">
                    Join opens 15 minutes before start
                    {opensAt ? ` (${opensAt})` : ''}.
                </p>
            )}
            {kind === 'module' && (
                <section>
                    <h2 className="text-lg font-semibold mb-2">Module 01 Resources</h2>
                    {resources.length === 0 && (
                        <p className="text-[#615d59]">No resources listed.</p>
                    )}
                    <ul className="list-disc pl-5">
                        {resources.map((item, i) => (
                            <li key={i}>
                                {item.url ? (
                                    <a href={item.url} className="underline" target="_blank" rel="noreferrer">
                                        {item.title || item.url}
                                    </a>
                                ) : (
                                    item.title
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            {embed ? (
                <iframe
                    title="Recording"
                    src={embed}
                    className="w-full aspect-video rounded-2xl border border-[#e6e6e6] bg-white"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : recordingUrl ? (
                <a href={recordingUrl} className="underline" target="_blank" rel="noreferrer">
                    Watch now
                </a>
            ) : null}
        </div>
    );
}
