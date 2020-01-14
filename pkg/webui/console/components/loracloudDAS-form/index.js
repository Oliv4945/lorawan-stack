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
import { defineMessages } from 'react-intl'
import * as Yup from 'yup'
import bind from 'autobind-decorator'

import Form from '../../../components/form'
import Input from '../../../components/input'
import SubmitBar from '../../../components/submit-bar'
import SubmitButton from '../../../components/submit-button'
import Notification from '../../../components/notification'
import Message from '../../../lib/components/message'
import KeyValueMap from '../../../components/key-value-map'
import ModalButton from '../../../components/button/modal-button'
import sharedMessages from '../../../lib/shared-messages'
import { id as loracloudDASIdRegexp, apiKey as webhookAPIKeyRegexp } from '../../lib/regexp'
import PropTypes from '../../../lib/prop-types'

import { mapLoracloudDASToFormValues, mapFormValuesToLoracloudDAS, blankValues } from './mapping'

const m = defineMessages({
  idPlaceholder: 'my-new-loracloud-das-id',
  deleteLoracloudDAS: 'Delete Loracloud integration',
  modalWarning:
    'Are you sure you want to delete integration "{loracloudDASId}"? Deleting an integration cannot be undone!',
  headers: 'Headers',
  headersKeyPlaceholder: 'Authorization',
  headersValuePlaceholder: 'Bearer my-auth-token',
  headersAdd: 'Add header entry',
  headersValidateRequired: 'All header entry values are required. Please remove empty entries.',
  token: 'LoRaCloud DAS token',
  tokenDesc:
    'The token will be provided to LoRaCloud DAS.',
  port: '200',
  portDesc: 'LoRaWAN port used for DAS messages.',
})

const headerCheck = headers =>
  headers === undefined ||
  (headers instanceof Array &&
    (headers.length === 0 || headers.every(header => header.key !== '' && header.value !== '')))

const validationSchema = Yup.object().shape({
  token_id: Yup.string()
    .matches(loracloudDASIdRegexp, sharedMessages.validateAlphanum)
    .min(2, sharedMessages.validateTooShort)
    .max(25, sharedMessages.validateTooLong)
    .required(sharedMessages.validateRequired),
  format: Yup.string().required(sharedMessages.validateRequired),
  headers: Yup.array().test('has no empty string values', m.headersValidateRequired, headerCheck),
  base_url: Yup.string()
    .url(sharedMessages.validateUrl)
    .required(sharedMessages.validateRequired),
  token: Yup.string().matches(webhookAPIKeyRegexp, sharedMessages.validateFormat),
})

@bind
export default class LoracloudDASForm extends Component {
  constructor(props) {
    super(props)

    this.form = React.createRef()
  }

  state = {
    error: '',
  }

  async handleSubmit(values, { setSubmitting, resetForm }) {
    const { appId, onSubmit, onSubmitSuccess, onSubmitFailure } = this.props
    const loracloudDAS = mapFormValuesToLoracloudDAS(values, appId)

    await this.setState({ error: '' })

    try {
      const result = await onSubmit(loraclouddas)

      resetForm(values)
      await onSubmitSuccess(result)
    } catch (error) {
      resetForm(values)

      await this.setState({ error })
      await onSubmitFailure(error)
    }
  }

  async handleDelete() {
    const { onDelete, onDeleteSuccess, onDeleteFailure } = this.props
    try {
      await onDelete()
      this.form.current.resetForm()
      onDeleteSuccess()
    } catch (error) {
      await this.setState({ error })
      onDeleteFailure()
    }
  }

  render() {
    const { update, initialLoracloudDasValue } = this.props
    const { error } = this.state
    let initialValues = blankValues
    if (update && initialLoracloudDasValue) {
      initialValues = mapLoracloudDAStoFormValues(initialLoracloudDasValue)
    }

    return (
      <Form
        onSubmit={this.handleSubmit}
        validationSchema={validationSchema}
        initialValues={initialValues}
        error={error}
        formikRef={this.form}
      >
        <Message component="h4" content={sharedMessages.generalInformation} />
        <Form.Field
          name="loracloudDAS_id"
          title={sharedMessages.loracloudDASId}
          placeholder={m.idPlaceholder}
          component={Input}
          required
          autoFocus
          disabled={update}
        />
        <LoracloudDASFormatSelector horizontal name="format" required />
        <Form.Field
          name="headers"
          title={m.headers}
          keyPlaceholder={m.headersKeyPlaceholder}
          valuePlaceholder={m.headersValuePlaceholder}
          addMessage={m.headersAdd}
          component={KeyValueMap}
        />
        <Form.Field
          name="base_url"
          title={sharedMessages.LoracloudDASBaseUrl}
          placeholder="https://dms.loracloud.com"
          component={Input}
          required
        />
        <Form.Field
          name="token"
          title={m.token}
          component={Input}
          description={m.tokenDesc}
          code
        />
        <Form.Field
          name="port"
          title={sharedMessages.port}
          placeholder={m.portPlaceholder}
          description={m.portDesc}
          component={Input}
          required
        />
        <SubmitBar>
          <Form.Submit
            component={SubmitButton}
            message={update ? sharedMessages.saveChanges : sharedMessages.addLoracloudDAS}
          />
          {update && (
            <ModalButton
              type="button"
              icon="delete"
              danger
              naked
              message={m.deleteLoracloudDAS}
              modalData={{
                message: {
                  values: { loracloudDASId: initialLoracloudDASValue.ids.loracloudDAS_id },
                  ...m.modalWarning,
                },
              }}
              onApprove={this.handleDelete}
            />
          )}
        </SubmitBar>
      </Form>
    )
  }
}

LoracloudDASForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func,
  onSubmitFailure: PropTypes.func,
  onDelete: PropTypes.func,
  onDeleteSuccess: PropTypes.func,
  onDeleteFailure: PropTypes.func,
  update: PropTypes.bool.isRequired,
  initialLoracloudValue: PropTypes.object,
}

LoracloudDASForm.defaultProps = {
  onSubmitSuccess: () => null,
  onSubmitFailure: () => null,
  onDeleteSuccess: () => null,
  onDeleteFailure: () => null,
  onDelete: () => null,
}
