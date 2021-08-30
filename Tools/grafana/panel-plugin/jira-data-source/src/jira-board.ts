import defaults from 'lodash/defaults';
import { DataQueryRequest, DataQueryResponse, MutableDataFrame, FieldType } from '@grafana/data';
import { MyQuery, defaultQuery } from './types';

let getJiraBoardSnapshot = (options: DataQueryRequest<MyQuery>): DataQueryResponse => {
  const data = options.targets.map((target) => {
    const query = defaults(target, defaultQuery);
    return new MutableDataFrame({
      refId: query.refId,
      fields: [
        { name: 'Backlog Count', values: [24], type: FieldType.number },
        { name: 'Blocked Count', values: [2], type: FieldType.number },
        { name: 'Total Bugs', values: [4], type: FieldType.number },
        { name: 'P0 Bugs', values: [1], type: FieldType.number },
      ],
    });
  });

  return { data };
};

export default getJiraBoardSnapshot;
