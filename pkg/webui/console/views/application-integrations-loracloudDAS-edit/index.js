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

import React, { Component } from 'react'
import { Container, Col, Row } from 'react-grid-system'
import bind from 'autobind-decorator'
import { connect } from 'react-redux'
import { defineMessages } from 'react-intl'
import { replace } from 'connected-react-router'

import PageTitle from '../../../components/page-title'
import Breadcrumb from '../../../components/breadcrumbs/breadcrumb'
import { withBreadcrumb } from '../../../components/breadcrumbs/context'
import LoracloudDASForm from '../../components/loracloudDAS-form'
import toast from '../../../components/toast'
import diff from '../../../lib/diff'
import sharedMessages from '../../../lib/shared-messages'
import withRequest from '../../../lib/components/with-request'

import {
  selectSelectedLoracloudDAS,
  selectLoracloudDASFetching,
  selectLoracloudDASError,
} from '../../store/selectors/loracloudDASs'
import { selectSelectedApplicationId } from '../../store/selectors/applications'
import {
  selectSelectedDeviceId,
  selectSelectedDeviceFormatters,
} from '../../store/selectors/devices'
import { getLoracloudDAS } from '../../store/actions/loracloudDASs'

import api from '../../api'
import PropTypes from '../../../lib/prop-types'

const m = defineMessages({
  editLoracloudDAS: 'Edit LoRaCloud integration',
  updateSuccess: 'Successfully updated LoRaCloud integration',
  deleteSuccess: 'Successfully deleted LoRaCloud integration',
})

const loracloudDASEntitySelector = [
  'package_name',
  'data',
]

@connect(
  state => ({
    appId: selectSelectedApplicationId(state),
    loracloudDAS: selectSelectedLoracloudDAS(state),
    deviceId: selectSelectedDeviceId(state),
    fetching: selectLoracloudDASFetching(state),
    error: selectLoracloudDASError(state),
  }),
  function (dispatch, { match }) {
    const { appId, deviceId, loracloudDASId } = match.params
    console.log("dispatch")
    console.log(dispatch)
    console.log(match)
    console.log(loracloudDASId)
    return {
      getLoracloudDAS: () => dispatch(getLoracloudDAS(appId, loracloudDASId, deviceId, loracloudDASEntitySelector)),
      navigateToList: () => dispatch(replace(`/applications/${appId}/integrations/loracloudDASs/${deviceId}/${loracloudDASId}`)),
    }
  },
)
@withRequest(
  ({ getLoracloudDAS }) => getLoracloudDAS(),
  ({ fetching, loracloudDAS }) => fetching || !Boolean(loracloudDAS),
)
@withBreadcrumb('apps.single.integrations.edit', function (props) {
  const {
    appId,
    match: {
      params: {
        loracloudDASId,
        deviceId
      },
    },
  } = props
  return (
    <Breadcrumb
      path={`/applications/${appId}/integrations/loracloudDASs/${deviceId}/${loracloudDASId}`}
      icon="general_settings"
      content={sharedMessages.edit}
    />
  )
})
@bind
export default class ApplicationLoracloudDASEdit extends Component {
  static propTypes = {
    appId: PropTypes.string.isRequired,
    match: PropTypes.match.isRequired,
    navigateToList: PropTypes.func.isRequired,
    loracloudDAS: PropTypes.loracloudDAS.isRequired,
  }

  async handleSubmit(updatedLoracloudDAS) {
    const {
      appId,
      match: {
        params: { loracloudDASId },
      },
      loracloudDAS: originalLoracloudDAS,
    } = this.props
    const patch = diff(originalLoracloudDAS, updatedLoracloudDAS, ['ids'])

    // Ensure that the header prop is always patched fully, otherwise we loose
    // old header entries.
    if ('headers' in patch) {
      patch.headers = updatedLoracloudDAS.headers
    }

    await api.application.loracloudDASs.update(appId, loracloudDASId, patch)
  }

  handleSubmitSuccess() {
    toast({
      message: m.updateSuccess,
      type: toast.types.SUCCESS,
    })
  }

  async handleDelete() {
    const {
      appId,
      match: {
        params: { loracloudDASId },
      },
    } = this.props

    await api.application.loracloudDASs.delete(appId, loracloudDASId)
  }

  async handleDeleteSuccess() {
    const { navigateToList } = this.props

    toast({
      message: m.deleteSuccess,
      type: toast.types.SUCCESS,
    })

    navigateToList()
  }

  render() {
    const { loracloudDAS, appId } = this.props

    return (
      <Container>
        <PageTitle title={m.editLoracloudDAS} />
        <Row>
          <Col lg={8} md={12}>
            <LoracloudDASForm
              update
              appId={appId}
              initialLoracloudDASValue={loracloudDAS}
              onSubmit={this.handleSubmit}
              onSubmitSuccess={this.handleSubmitSuccess}
              onDelete={this.handleDelete}
              onDeleteSuccess={this.handleDeleteSuccess}
            />
          </Col>
        </Row>
      </Container>
    )
  }
}
