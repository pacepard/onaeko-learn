import type { IAPIResponse } from '@/utils/interfaces.util';
import type AxiosService from '../base/axios';
import { ApiPath } from '../paths';

class ProgramsAPI {
    constructor(private axiosService: AxiosService) {}

    list(): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.programs,
            isAuth: false,
            payload: {},
        });
    }

    getBySlug(slug: string): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.programSlug(slug),
            isAuth: false,
            payload: {},
        });
    }

    events(programId: string, window?: 'upcoming' | 'previous'): Promise<IAPIResponse> {
        const q = window ? `?window=${window}` : '';
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: `${ApiPath.programEvents(programId)}${q}`,
            isAuth: true,
            payload: {},
        });
    }

    eventDetail(programId: string, eventId: string): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.eventDetail(programId, eventId),
            isAuth: true,
            payload: {},
        });
    }

    join(programId: string, eventId: string): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.eventJoin(programId, eventId),
            isAuth: true,
            payload: {},
        });
    }

    calendar(programId: string, eventId: string): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.eventCalendar(programId, eventId),
            isAuth: true,
            payload: {},
        });
    }
}

export default ProgramsAPI;
