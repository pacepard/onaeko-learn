import type { IRoute } from '@/utils/interfaces.util';
import { LearnLayout } from '@/components/layouts/learn-layout';
import Dashboard from '@/app/Dashboard';
import CatalogIndex from '@/app/CatalogIndex';
import ProgramHome from '@/app/ProgramHome';
import SessionClass from '@/app/SessionClass';
import Recordings from '@/app/Recordings';
import CourseHome from '@/app/CourseHome';
import ScholarshipPage from '@/app/ScholarshipPage';

const learnRoutes: Array<IRoute> = [
    {
        name: 'learn-shell',
        path: '/',
        element: <LearnLayout />,
        children: [
            { name: 'home', index: true, element: <Dashboard /> },
            {
                name: 'programs',
                path: 'programs',
                element: <CatalogIndex kind="program" />,
            },
            {
                name: 'program-home',
                path: 'programs/:slug',
                element: <ProgramHome />,
            },
            {
                name: 'event-class',
                path: 'programs/:slug/events/:eventId',
                element: <SessionClass kind="event" />,
            },
            {
                name: 'recordings',
                path: 'programs/:slug/recordings',
                element: <Recordings />,
            },
            {
                name: 'courses',
                path: 'courses',
                element: <CatalogIndex kind="course" />,
            },
            {
                name: 'course-home',
                path: 'courses/:slug',
                element: <CourseHome />,
            },
            {
                name: 'scholarship',
                path: 'courses/:slug/scholarship',
                element: <ScholarshipPage />,
            },
            {
                name: 'module-class',
                path: 'courses/:slug/modules/:moduleId',
                element: <SessionClass kind="module" />,
            },
        ],
    },
];

export default learnRoutes;
