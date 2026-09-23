import type { IAPIResponse } from '@/utils/interfaces.util';
import type AxiosService from '../base/axios';
import { ApiPath } from '../paths';

class CoursesAPI {
    constructor(private axiosService: AxiosService) {}

    list(): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.courses,
            isAuth: false,
            payload: {},
        });
    }

    getBySlug(slug: string): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.courseSlug(slug),
            isAuth: false,
            payload: {},
        });
    }

    modules(courseId: string, window?: 'upcoming' | 'previous'): Promise<IAPIResponse> {
        const q = window ? `?window=${window}` : '';
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: `${ApiPath.courseModules(courseId)}${q}`,
            isAuth: true,
            payload: {},
        });
    }

    moduleDetail(courseId: string, moduleId: string): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.moduleDetail(courseId, moduleId),
            isAuth: true,
            payload: {},
        });
    }

    join(courseId: string, moduleId: string): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.moduleJoin(courseId, moduleId),
            isAuth: true,
            payload: {},
        });
    }

    calendar(courseId: string, moduleId: string): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.moduleCalendar(courseId, moduleId),
            isAuth: true,
            payload: {},
        });
    }
}

export default CoursesAPI;
