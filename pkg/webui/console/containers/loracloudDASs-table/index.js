// Copyright © 2019 The Things Network Foundation, The Things Industries B.V.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react'
import { defineMessages } from 'react-intl'
import bind from 'autobind-decorator'

import FetchTable from '../fetch-table'
import Message from '../../../lib/components/message'

import sharedMessages from '../../../lib/shared-messages'

import { getLoracloudDASsList } from '../../../console/store/actions/loracloudDASs'
import {
  selectLoracloudDASs,
  selectLoracloudDASsTotalCount,
  selectLoracloudDASsFetching,
} from '../../../console/store/selectors/loracloudDASs'

const m = defineMessages({
  packageName: 'Package name',
  port: 'Port',
  deviceName: 'Device ID'
})

const headers = [
  {
    name: 'package_name',
    displayName: m.packageName,
    width: 35,
  },
  {
    name: 'ids.end_device_ids.device_id',
    displayName: m.deviceName,
    width: 20,
  },
  {
    name: 'ids.f_port',
    displayName: m.port,
    width: 25,
  },
]

@bind
export default class LoracloudDASsTable extends React.Component {
  constructor(props) {
    super(props)

    const { appId } = props
    this.getLoracloudDASsList = () => getLoracloudDASsList(appId)
  }

  baseDataSelector(state) {
    return {
      loracloudDASs: selectLoracloudDASs(state),
      totalCount: selectLoracloudDASsTotalCount(state),
      fetching: selectLoracloudDASsFetching(state),
    }
  }

  render() {
    return (
      <FetchTable
        entity="loracloudDASs"
        addMessage={sharedMessages.addLoracloudDAS}
        headers={headers}
        getItemsAction={this.getLoracloudDASsList}
        baseDataSelector={this.baseDataSelector}
        tableTitle={<Message content={sharedMessages.loracloudDASs} />}
        {...this.props}
      />
    )
  }
}
