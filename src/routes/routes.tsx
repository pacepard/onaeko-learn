import { Route, Routes } from 'react-router-dom';
import type { IRoute } from '@/utils/interfaces.util';
import learnRoutes from './learn.route';
import ErrorPage from '@/app/Error';

const appRoutes: Array<IRoute> = [...learnRoutes];

function renderRoutes(routes: Array<IRoute>) {
    return routes.map((route) => {
        if (route.index) {
            return <Route key={route.name} index element={route.element} />;
        }
        return (
            <Route key={route.name} path={route.path} element={route.element}>
                {route.children ? renderRoutes(route.children) : null}
            </Route>
        );
    });
}

function MainRoutes() {
    return (
        <Routes>
            {renderRoutes(appRoutes)}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
}

export default MainRoutes;
