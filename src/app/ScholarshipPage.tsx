import { useEffect, useId, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router-dom';
import { Button } from '@onaeko/ui/button';
import { OnaekoAPI } from '@/api/base/config';
import { requireSession } from '@/utils/accounts';
import { academy } from '@/styles/academy-ui';
import {
    SCHOLARSHIP_Q1,
    SCHOLARSHIP_Q2,
    SCHOLARSHIP_Q3,
    SCHOLARSHIP_Q4,
    SCHOLARSHIP_Q5,
    mapCanPayEnrollmentFee,
} from '@/utils/scholarship-map';

const schema = z.object({
    primaryReason: z.string().min(1),
    experienceLevel: z.string().min(1),
    careerRelevance: z.string().min(1),
    completionConfidence: z.string().min(1),
    canPayOption: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

const QUESTIONS: Array<{
    name: keyof FormValues;
    label: string;
    options: readonly string[];
}> = [
    {
        name: 'primaryReason',
        label: 'What is your primary reason for applying for a scholarship?',
        options: SCHOLARSHIP_Q1,
    },
    {
        name: 'experienceLevel',
        label: 'What is your current level of Growth Engineering experience?',
        options: SCHOLARSHIP_Q2,
    },
    {
        name: 'careerRelevance',
        label: 'How relevant is Growth Engineering to your current career or goals?',
        options: SCHOLARSHIP_Q3,
    },
    {
        name: 'completionConfidence',
        label: 'How confident are you that you can complete the programme?',
        options: SCHOLARSHIP_Q4,
    },
    {
        name: 'canPayOption',
        label: 'If you are awarded a scholarship, would you be able to pay the enrolment fee?',
        options: SCHOLARSHIP_Q5,
    },
];

const FormModal = ({
    open,
    title,
    onClose,
    children,
}: {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}) => {
    const titleId = useId();
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
            <button
                type="button"
                className={`absolute inset-0 ${academy.overlay}`}
                aria-label="Close dialog"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={`relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col ${academy.modal}`}
            >
                <div className="flex items-center justify-between border-b border-[#e6e6e6] px-4 py-3">
                    <h2
                        id={titleId}
                        className="text-lg font-semibold text-[#000000]"
                    >
                        {title}
                    </h2>
                    <button
                        type="button"
                        className="min-h-11 min-w-11 rounded-lg text-[#615d59] hover:bg-[#f6f5f4]"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
                <div className="overflow-y-auto px-4 py-4">{children}</div>
            </div>
        </div>
    );
};

export default function ScholarshipPage() {
    const { slug = '' } = useParams();
    const [existing, setExisting] = useState<any>(null);
    const [courseId, setCourseId] = useState('');
    const [price, setPrice] = useState<number | undefined>();
    const [message, setMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            primaryReason: '',
            experienceLevel: '',
            careerRelevance: '',
            completionConfidence: '',
            canPayOption: '',
        },
    });

    useEffect(() => {
        if (!requireSession()) return;
        let cancelled = false;
        (async () => {
            const [course, mine] = await Promise.all([
                OnaekoAPI.courses.getBySlug(slug),
                OnaekoAPI.enroll.scholarshipMe(),
            ]);
            if (cancelled) return;
            setCourseId(course.data?._id || course.data?.id || '');
            setPrice(course.data?.scholarshipPrice);
            const rows = mine.data?.items || mine.data || [];
            const row = (Array.isArray(rows) ? rows : []).find(
                (item: any) =>
                    item.slug === slug || item.courseId === course.data?._id,
            );
            if (row) {
                setExisting(row);
            } else {
                setModalOpen(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [slug]);

    const resumePay = async () => {
        if (!existing?.enrollmentId) return;
        const resume = await OnaekoAPI.enroll.payment(existing.enrollmentId);
        if (resume.data?.authorizationUrl) {
            window.location.assign(resume.data.authorizationUrl);
        }
    };

    if (existing) {
        return (
            <div className="mx-auto max-w-xl space-y-4">
                <h1 className="text-3xl font-semibold text-[#000000]">
                    Scholarship status
                </h1>
                <p className="capitalize text-[#615d59]">{existing.status}</p>
                {(existing.status === 'approved' ||
                    existing.status === 'APPROVED') && (
                    <Button
                        type="button"
                        className={`min-h-11 rounded-full text-sm font-medium ${academy.cta}`}
                        onClick={() => void resumePay()}
                    >
                        Continue to payment
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-xl space-y-4">
            <h1 className="text-3xl font-semibold text-[#000000]">
                Scholarship application
            </h1>
            {typeof price === 'number' && (
                <p className="text-[#615d59]">
                    Scholarship enrolment fee{' '}
                    {`₦${(price / 100).toLocaleString('en-NG')}`}.
                </p>
            )}
            <Button
                type="button"
                className={`min-h-11 rounded-full text-sm font-medium ${academy.cta}`}
                onClick={() => setModalOpen(true)}
            >
                Open application
            </Button>

            <FormModal
                open={modalOpen}
                title="Scholarship application"
                onClose={() => setModalOpen(false)}
            >
                <form
                    className="space-y-4"
                    onSubmit={form.handleSubmit(async (values) => {
                        const response = await OnaekoAPI.enroll.applyScholarship(
                            {
                                targetType: 'course',
                                targetId: courseId,
                                primaryReason: values.primaryReason,
                                experienceLevel: values.experienceLevel,
                                careerRelevance: values.careerRelevance,
                                completionConfidence:
                                    values.completionConfidence,
                                canPayEnrollmentFee: mapCanPayEnrollmentFee(
                                    values.canPayOption,
                                ),
                            },
                        );
                        if (response.error) {
                            setMessage(response.message || 'Could not submit');
                            return;
                        }
                        setExisting({ status: 'pending' });
                        setModalOpen(false);
                    })}
                >
                    {typeof price === 'number' && (
                        <p className="text-sm text-[#615d59]">
                            Scholarship enrolment fee{' '}
                            {`₦${(price / 100).toLocaleString('en-NG')}`}.
                        </p>
                    )}
                    {QUESTIONS.map((question) => (
                        <label key={question.name} className="block space-y-1">
                            <span className="text-sm font-medium text-[#31302e]">
                                {question.label}
                            </span>
                            <select
                                className={academy.select}
                                {...form.register(question.name)}
                            >
                                <option value="" disabled>
                                    Select an option
                                </option>
                                {question.options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </label>
                    ))}
                    {message && <p className="text-sm text-red-700">{message}</p>}
                    <Button
                        type="submit"
                        className={`min-h-11 w-full rounded-full text-sm font-medium ${academy.cta}`}
                        disabled={form.formState.isSubmitting}
                    >
                        Submit Application
                    </Button>
                </form>
            </FormModal>
        </div>
    );
}
