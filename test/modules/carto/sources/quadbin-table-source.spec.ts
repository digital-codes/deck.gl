// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {quadbinTableSource} from '@deck.gl/carto';
import test from 'tape-catch';
import {withMockFetchMapsV3} from '../mock-fetch';

test('quadbinTableSource', async t => {
  await withMockFetchMapsV3(async calls => {
    const tilejson = await quadbinTableSource({
      connectionName: 'carto_dw',
      accessToken: '<token>',
      tableName: 'a.b.quadbin_table',
      aggregationExp: 'SUM(population) as pop'
    });

    t.is(calls.length, 2, 'calls fetch() x2');

    const [initCall, tilesetCall] = calls;

    t.match(initCall.url, /v3\/maps\/carto_dw\/table/, 'connection');
    t.match(initCall.url, /aggregationExp=SUM%28population%29\+as\+pop/, 'aggregationExp');
    t.match(initCall.url, /spatialDataColumn=quadbin/, 'spatialDataColumn');
    t.match(initCall.url, /spatialDataType=quadbin/, 'spatialDataType');
    t.match(initCall.url, /name=a.b.quadbin_table/, 'table');

    t.match(tilesetCall.url, /^https:\/\/xyz\.com\/\?format\=tilejson\&cache\=/, 'tileset URL');

    t.ok(tilejson, 'returns tilejson');
    t.deepEqual(
      tilejson.tiles,
      ['https://xyz.com/{z}/{x}/{y}?formatTiles=binary'],
      'tilejson.tiles'
    );
    t.equal(tilejson.accessToken, '<token>', 'tilejson.accessToken');
  }).catch(t.fail);
  t.end();
});
