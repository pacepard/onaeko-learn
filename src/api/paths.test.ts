import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ApiPath } from './paths.ts';
import { LEARN_ROUTE_PATHS, RouteURL } from '../routes/paths.ts';

describe('P091 Learn ApiPath', () => {
    it('uses mounted Academy suffixes only', () => {
        assert.equal(ApiPath.user, '/user/');
        assert.equal(ApiPath.enrollDashboard, '/enroll/me/dashboard');
        assert.equal(ApiPath.enrollRecommended, '/enroll/recommended');
        assert.equal(ApiPath.scholarshipMe, '/enroll/scholarship/me');
        assert.equal(ApiPath.loggedInUser, '/user/');
    });
});

describe('P090 Learn RouteURL', () => {
    it('maps board IA and keeps login unmounted as a constant only', () => {
        assert.equal(RouteURL.home, '/');
        assert.equal(LEARN_ROUTE_PATHS.programHome, '/programs/:slug');
        assert.equal(LEARN_ROUTE_PATHS.moduleClass, '/courses/:slug/modules/:moduleId');
        assert.equal(RouteURL.login, '/login');
    });
});
