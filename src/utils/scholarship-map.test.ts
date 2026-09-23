import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mapCanPayEnrollmentFee } from './scholarship-map.ts';

describe('P097 Q5 map', () => {
    it('maps Yes* to true and No / not sure to false', () => {
        assert.equal(mapCanPayEnrollmentFee('Yes, I can pay it immediately'), true);
        assert.equal(mapCanPayEnrollmentFee('Yes, I can pay it with some planning'), true);
        assert.equal(mapCanPayEnrollmentFee('No, I cannot currently afford it'), false);
        assert.equal(mapCanPayEnrollmentFee("I'm not sure"), false);
    });
});
