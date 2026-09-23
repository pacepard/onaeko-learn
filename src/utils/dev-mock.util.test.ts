import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    fail,
    isUseMocksEnabled,
    mockCall,
    ok,
} from './dev-mock.util.ts';

describe('P083 Learn USE_MOCKS gate', () => {
    it('is false when VITE_ENVIRONMENT is not local', () => {
        assert.equal(isUseMocksEnabled('staging', 'true'), false);
        assert.equal(isUseMocksEnabled('production', 'true'), false);
        assert.equal(isUseMocksEnabled('development', 'true'), false);
        assert.equal(isUseMocksEnabled(undefined, 'true'), false);
    });

    it('is true only for local + explicit true flag', () => {
        assert.equal(isUseMocksEnabled('local', 'true'), true);
        assert.equal(isUseMocksEnabled('local', 'false'), false);
        assert.equal(isUseMocksEnabled('local', undefined), false);
    });
});

describe('P083 Learn mockCall envelope', () => {
    it('returns locked envelope keys for GET /user/', async () => {
        const res = await mockCall({
            type: 'default',
            method: 'GET',
            path: '/user/',
            payload: {},
        });
        assert.equal(res.error, false);
        assert.ok(Array.isArray(res.errors));
        assert.equal(typeof res.message, 'string');
        assert.equal(res.status, 200);
        assert.equal((res.data as { firstName: string }).firstName, 'Damola');
        assert.equal((res.data as { lastName: string }).lastName, 'Oladipo');
    });

    it('returns locked envelope keys for POST /enroll/', async () => {
        const res = await mockCall({
            type: 'default',
            method: 'POST',
            path: '/enroll/',
            payload: { targetType: 'program', targetId: 'prog-ai-education' },
        });
        assert.equal(res.error, false);
        assert.ok(Array.isArray(res.errors));
        assert.equal(typeof res.message, 'string');
        assert.equal(res.status, 200);
        assert.equal((res.data as { status: string }).status, 'ACTIVE');
    });

    it('ok / fail helpers match the locked shape', () => {
        const good = ok({ a: 1 });
        assert.deepEqual(
            { error: good.error, status: good.status, data: good.data },
            { error: false, status: 200, data: { a: 1 } },
        );
        const bad = fail(403, 'nope');
        assert.equal(bad.error, true);
        assert.equal(bad.status, 403);
        assert.deepEqual(bad.errors, ['nope']);
    });
});
