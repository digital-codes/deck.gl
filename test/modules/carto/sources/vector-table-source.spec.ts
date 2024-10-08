// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {vectorTableSource} from '@deck.gl/carto';
import test from 'tape-catch';
import {withMockFetchMapsV3} from '../mock-fetch';

test('vectorTableSource', async t => {
  await withMockFetchMapsV3(async calls => {
    const tilejson = await vectorTableSource({
      connectionName: 'carto_dw',
      accessToken: '<token>',
      tableName: 'a.b.vector_table',
      columns: ['a', 'b'],
      spatialDataColumn: 'mygeom'
    });

    t.is(calls.length, 2, 'calls fetch() x2');

    const [initCall, tilesetCall] = calls;

    t.match(initCall.url, /v3\/maps\/carto_dw\/table/, 'connection');
    t.match(initCall.url, /name=a\.b\.vector_table/, 'table');
    t.match(initCall.url, /columns=a%2Cb/, 'columns');
    t.match(initCall.url, /spatialDataColumn=mygeom/, 'spatialDataColumn');
    t.match(initCall.url, /spatialDataType=geo/, 'spatialDataType');

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
