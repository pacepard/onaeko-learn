import type { IAPIResponse } from '@/utils/interfaces.util';
import type AxiosService from '../base/axios';
import { ApiPath } from '../paths';

class EnrollAPI {
    constructor(private axiosService: AxiosService) {}

    create(payload: { targetType: 'program' | 'course'; targetId: string }): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'POST',
            path: ApiPath.enroll,
            isAuth: true,
            payload,
        });
    }

    me(): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.enrollMe,
            isAuth: true,
            payload: {},
        });
    }

    dashboard(): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.enrollDashboard,
            isAuth: true,
            payload: {},
        });
    }

    recommended(): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.enrollRecommended,
            isAuth: true,
            payload: {},
        });
    }

    payment(enrollmentId: string): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.enrollPayment(enrollmentId),
            isAuth: true,
            payload: {},
        });
    }

    applyScholarship(payload: {
        targetType: 'course';
        targetId: string;
        primaryReason: string;
        experienceLevel: string;
        careerRelevance: string;
        completionConfidence: string;
        canPayEnrollmentFee: boolean;
    }): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'POST',
            path: ApiPath.scholarship,
            isAuth: true,
            payload,
        });
    }

    scholarshipMe(): Promise<IAPIResponse> {
        return this.axiosService.call({
            type: 'default',
            method: 'GET',
            path: ApiPath.scholarshipMe,
            isAuth: true,
            payload: {},
        });
    }
}

export default EnrollAPI;
