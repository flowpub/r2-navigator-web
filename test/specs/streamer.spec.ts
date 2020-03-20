import { assert } from 'chai';

import { Publication } from '../../src/streamer';

describe('StreamerClient', () => {
  describe('#openPublication()', () => {
    it('should open publication from url', async () => {
      const pub = await Publication.ParseFromURL('/fixtures/publications/metamorphosis/manifest.json');
      // tslint:disable-next-line:no-http-string
      assert.equal(pub['@context']!, 'http://readium.org/webpub/default.jsonld');
    });
  });
});
