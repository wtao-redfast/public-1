import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';

import { MyQuery, MyDataSourceOptions } from './types';
//import { fromPairs } from 'lodash';
import getJiraBoardSnapshot from './jira-board';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  settings?: DataSourceInstanceSettings<MyDataSourceOptions>;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.settings = instanceSettings;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    // Example: Return a constant for each query.
    /*
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();
    const data = options.targets.map((target) => {
      const query = defaults(target, defaultQuery);
      return new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'Time', values: [from, to], type: FieldType.time },
          { name: 'Value', values: [query.constant, query.constant], type: FieldType.number },
        ],
      });
    });
    return { data };
    */
    return getJiraBoardSnapshot(options);
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
