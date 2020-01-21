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
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router'

import sharedMessages from '../../../lib/shared-messages'
import Breadcrumb from '../../../components/breadcrumbs/breadcrumb'
import { withBreadcrumb } from '../../../components/breadcrumbs/context'
import ErrorView from '../../../lib/components/error-view'
import SubViewError from '../error/sub-view'
import ApplicationLoracloudDASsList from '../application-integrations-loracloudDASs-list'
import ApplicationLoracloudDASAdd from '../application-integrations-loracloudDAS-add'
import ApplicationLoracloudDASEdit from '../application-integrations-loracloudDAS-edit'
import withFeatureRequirement from '../../lib/components/with-feature-requirement'

import { mayViewApplicationEvents } from '../../lib/feature-checks'
import { selectSelectedApplicationId } from '../../store/selectors/applications'
import PropTypes from '../../../lib/prop-types'

@connect(state => ({ appId: selectSelectedApplicationId(state) }))
@withFeatureRequirement(mayViewApplicationEvents, {
  redirect: ({ appId }) => `/applications/${appId}`,
})
@withBreadcrumb('apps.single.integrations.loracloudDASs', ({ appId }) => (
  <Breadcrumb
    path={`/applications/${appId}/integrations/loracloudDASs`}
    icon="extension"
    content={sharedMessages.loracloudDASs}
  />
))
export default class ApplicationLoracloudDASs extends React.Component {
  static propTypes = {
    match: PropTypes.match.isRequired,
  }

  render() {
    const { match } = this.props

    return (
      <ErrorView ErrorComponent={SubViewError}>
        <Switch>
          <Route exact path={`${match.path}`} component={ApplicationLoracloudDASsList} />
          <Route exact path={`${match.path}/add`} component={ApplicationLoracloudDASAdd} />
          <Route path={`${match.path}/:deviceId/:loracloudDASId`} component={ApplicationLoracloudDASEdit} />
        </Switch>
      </ErrorView>
    )
  }
}
