type EnrollmentTab = 'ongoing' | 'completed';

const TABS: { id: EnrollmentTab; label: string }[] = [
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' },
];

type Props = {
    value: EnrollmentTab;
    onValueChange: (tab: EnrollmentTab) => void;
};

/** Tally-calm tabs on Academy hairline — active = inverted black (DESIGN.md / board). */
export default function EnrollmentTabs({ value, onValueChange }: Props) {
    return (
        <div
            role="tablist"
            aria-label="Enrollment status"
            className="inline-flex flex-wrap gap-1 rounded-full border border-[#e6e6e6] bg-white p-1"
        >
            {TABS.map((tab) => {
                const selected = value === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        id={`enroll-tab-${tab.id}`}
                        onClick={() => onValueChange(tab.id)}
                        className={`min-h-11 rounded-full px-4 text-sm font-medium transition-colors ${
                            selected
                                ? 'bg-[#000000] text-white'
                                : 'text-[#615d59] hover:bg-[#f6f5f4] hover:text-[#31302e]'
                        }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}

export type { EnrollmentTab };
