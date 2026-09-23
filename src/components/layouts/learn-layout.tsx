import { useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import {
    BookOpen,
    GraduationCap,
    Home,
    Menu,
    Settings,
    Users,
    X,
} from 'lucide-react';
import { Toaster } from '@onaeko/ui/sonner';
import { RouteURL } from '@/routes/paths';
import { accountsMyAccountUrl } from '@/utils/accounts';
import { academy } from '@/styles/academy-ui';
import { OnaekoIcon, OnaekoLogo } from '@/components/brand/OnaekoBrand';

type NavKey = 'home' | 'programs' | 'courses' | 'members' | 'settings';

const shareProfile = async () => {
    const url = window.location.href;
    try {
        await navigator.clipboard.writeText(url);
    } catch {
        window.prompt('Copy profile link', url);
    }
};

/** Troott Studio shell structure + Academy DESIGN.md colors / Onaeko brand. */
export const LearnLayout = ({
    membersSwap = false,
}: {
    membersSwap?: boolean;
}) => {
    const location = useLocation();
    const { slug } = useParams();
    const [open, setOpen] = useState(false);
    const programDetail = /^\/programs\/[^/]+/.test(location.pathname);
    const enrolledProgram = (membersSwap || programDetail) && Boolean(slug);

    const items: {
        key: NavKey;
        label: string;
        to?: string;
        icon: typeof Home;
    }[] = [
        { key: 'home', label: 'Home', to: RouteURL.home, icon: Home },
        {
            key: 'programs',
            label: 'Programs',
            to: RouteURL.programs,
            icon: GraduationCap,
        },
        enrolledProgram
            ? { key: 'members', label: 'Members', icon: Users }
            : {
                  key: 'courses',
                  label: 'Courses',
                  to: RouteURL.courses,
                  icon: BookOpen,
              },
        { key: 'settings', label: 'Settings', icon: Settings },
    ];

    const active = (to?: string) =>
        to === RouteURL.home
            ? location.pathname === '/'
            : Boolean(to && location.pathname.startsWith(to));

    const navRow = (
        item: (typeof items)[number],
        onNavigate?: () => void,
    ) => {
        const Icon = item.icon;
        const isActive = active(item.to);
        const className = `group/menu-button flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
            isActive ? academy.navActive : academy.navIdle
        }`;

        if (item.to) {
            return (
                <Link
                    key={item.key}
                    to={item.to}
                    onClick={onNavigate}
                    data-active={isActive}
                    className={className}
                >
                    <Icon
                        className={`h-5 w-5 shrink-0 ${
                            isActive ? academy.iconActive : academy.iconIdle
                        }`}
                        aria-hidden
                    />
                    <span>{item.label}</span>
                </Link>
            );
        }

        return (
            <span
                key={item.key}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#a39e98]"
                aria-disabled
            >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span>{item.label}</span>
            </span>
        );
    };

    return (
        <div
            className={`flex min-h-screen min-w-0 overflow-hidden ${academy.canvas} font-sans ${academy.ink}`}
        >
            {open && (
                <button
                    type="button"
                    className={`fixed inset-0 z-20 lg:hidden ${academy.overlay}`}
                    aria-label="Close menu overlay"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r ${academy.border} ${academy.sidebar} transition-transform lg:static lg:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center gap-2 px-4 py-5">
                    <OnaekoIcon width={28} height={28} />
                    <div className="min-w-0">
                        <OnaekoLogo width={120} height={26} />
                        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#a39e98]">
                            Learn
                        </p>
                    </div>
                </div>

                <div className="px-3 pb-2">
                    <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a39e98]">
                        Learning
                    </p>
                    <div className={`mb-2 border-b ${academy.border}`} />
                    <nav className="flex flex-col gap-0.5" aria-label="Main">
                        {items.map((item) =>
                            navRow(item, () => setOpen(false)),
                        )}
                    </nav>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header
                    className={`sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b ${academy.border} ${academy.shell} px-4`}
                >
                    <div className="flex min-w-0 items-center gap-2">
                        <button
                            type="button"
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#31302e] hover:bg-[#f6f5f4] lg:hidden"
                            aria-label={open ? 'Close menu' : 'Open menu'}
                            onClick={() => setOpen((v) => !v)}
                        >
                            {open ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                        <button
                            type="button"
                            className="min-h-11 rounded-full px-3 text-sm font-medium text-[#31302e] hover:bg-[#f6f5f4]"
                            onClick={() =>
                                window.location.assign(accountsMyAccountUrl())
                            }
                        >
                            Your Account
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <span className="rounded-full border border-[#e6e6e6] px-3 py-1 text-sm text-[#f36827]">
                            Onaeko Pro
                        </span>
                        <button
                            type="button"
                            className="min-h-11 rounded-full px-3 text-sm font-medium text-[#31302e] hover:bg-[#f6f5f4]"
                            onClick={() => void shareProfile()}
                        >
                            Share Profile
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-auto px-4 py-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
            <Toaster />
        </div>
    );
};
