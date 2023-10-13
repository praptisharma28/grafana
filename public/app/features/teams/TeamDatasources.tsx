import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { DataSourceInstanceSettings } from '@grafana/data/src/types/datasource';
import { getBackendSrv } from '@grafana/runtime';
import { Icon, Tooltip } from '@grafana/ui';
import EmptyListCTA from 'app/core/components/EmptyListCTA/EmptyListCTA';
import { Team } from 'app/types';

const mapDispatchToProps = {};

const connector = connect(null, mapDispatchToProps);
const headerTooltip = `Manage your team's data source access permissions.`;

interface OwnProps {
  team: Team;
}
export type Props = ConnectedProps<typeof connector> & OwnProps;

export const TeamDatasources = ({ team }: Props) => {
  const datasources: DataSourceInstanceSettings[] = [
    {
      id: 1,
      name: 'Prometheus',
      type: 'prometheus',
      uid: 'prometheus',
      meta: { id: 'prometheus', name: 'Prometheus', uid: 'prometheus', info: { logos: { small: '', large: '' } } },
      jsonData: {},
      secureJsonFields: {},
      version: 1,
    },
  ];
  return (
    <>
      {datasources.length === 0 && (
        <EmptyListCTA
          buttonIcon="lock"
          title="This team has access to no data sources"
          buttonTitle="Manage data sources"
          buttonLink="/connections/datasources"
          proTip={headerTooltip}
          proTipLinkTitle="Learn more"
          proTipLink="https://grafana.com/docs/grafana/latest/administration/data-source-management/#data-source-permissions"
          proTipTarget="_blank"
          buttonDisabled={false}
        />
      )}

      {datasources.length > 0 && (
        <div>
          <table className="filter-table gf-form-group">
            <thead>
              <tr>
                <th style={{ width: '1%' }} />
                <th>Datasource</th>
                <th style={{ width: '1%' }} />
              </tr>
            </thead>
            <tbody>{datasources.map((datasource) => renderDatasource(datasource))}</tbody>
          </table>
        </div>
      )}
    </>
  );
};

function renderDatasource(datasource: DataSourceInstanceSettings) {
  return (
    <tr key={datasource.id}>
      <td style={{ width: '1%' }}>
        <img
          className="filter-table__avatar"
          src={datasource.meta.info.logos.small}
          alt={`${datasource.meta.name} Logo`}
        />
      </td>
      <td>{datasource.name}</td>
      <td style={{ width: '1%' }}>
        <a
          href={`connections/datasources/edit/${datasource.id}/permissions/`}
          aria-label={`Edit data source permissions ${datasource.name}`}
        >
          <Tooltip content={'Edit data source permissions'}>
            <Icon name={'pen'} />
          </Tooltip>
        </a>
      </td>
    </tr>
  );
}

const getDatasources = (team: Team): Promise<DataSourceInstanceSettings[]> => getBackendSrv().get(`/api/datasources`);

export default connector(TeamDatasources);