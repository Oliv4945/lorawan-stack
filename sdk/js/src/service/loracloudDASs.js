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

import Marshaler from '../util/marshaler'
import loracloudDASs from '../../../../pkg/webui/console/store/middleware/logics/loracloudDASs'

class LoracloudDASs {
  constructor(registry) {
    this._api = registry
  }

  async getAll(appId) {
    console.log("GetAll")
    const result = await this._api.ListAssociations({
      routeParams: {
        'ids.application_ids.application_id': appId,
        'ids.device_id': 'test-device'
      },
    })
    // OGZ Workaround to have correct results in "entities"
    console.log(result)
    if (!isNaN(result.headers['x-total-count'])) {
      delete result.headers['x-total-count']
    }

    console.log(Marshaler.payloadListResponse('associations', result))
    return Marshaler.payloadListResponse('associations', result)
  }

  async listAssociations(appId, devId, selector) {
    const fieldMask = Marshaler.selectorToFieldMask(selector)
    const result = await this._api.ListAssociations({
      routeParams: {
        'ids.application_ids.application_id': appId,
        'ids.device_id': devId,
      },
    },
      fieldMask
    )
    console.log("listAssociations")
    console.log(Marshaler.payloadListResponse('associations', result))
    return Marshaler.payloadListResponse('associations', result)
  }

  async list(appId, devId, selector) {
    const fieldMask = Marshaler.selectorToFieldMask(selector)
    const result = await this._api.List({
      routeParams: {
        'ids.application_ids.application_id': appId,
        'ids.device_id': devId,
      },
    },
      fieldMask
    )
    console.log("list 2")
    console.log(Marshaler.payloadListResponse('associations', result))
    return Marshaler.payloadListResponse('associations', result)
  }

  async create(
    appId,
    devId,
    port,
    token,
  ) {
    const result = await this._api.SetAssociation(
      {
        routeParams: {
          'association.ids.end_device_ids.application_ids.application_id': appId,
          'association.ids.end_device_ids.device_id': devId,
          'association.ids.f_port': port,
        },
      },
      {
        association: {
          package_name: 'lora-cloud-device-management-v1',
          data: { token: token }
        },
        field_mask: { paths: ['package_name', 'data'] },
      }
    )
    console.log("create")
    console.log(result)

    return Marshaler.payloadSingleResponse(result)
  }

  async getById(appId, loracloudDASId, deviceId, selector) {
    const fieldMask = Marshaler.selectorToFieldMask(selector)
    const result = await this._api.GetAssociation(
      {
        routeParams: {
          'ids.end_device_ids.application_ids.application_id': appId,
          'ids.end_device_ids.device_id': deviceId,
          'ids.f_port': loracloudDASId,
        },
      },
      fieldMask,
    )
    console.log(["getbyid", Marshaler.payloadSingleResponse(result)])
    return Marshaler.payloadSingleResponse(result)
  }

  async updateById(
    appId,
    loracloudDASId,
    patch,
    mask = Marshaler.fieldMaskFromPatch(patch, this._api.SetAllowedFieldMaskPaths),
  ) {
    const result = await this._api.Set(
      {
        routeParams: {
          'loracloudDAS.ids.application_ids.application_id': appId,
          'loracloudDAS.ids.loracloudDAS_id': loracloudDASId,
        },
      },
      {
        loracloudDAS: patch,
        field_mask: Marshaler.fieldMask(mask),
      },
    )

    return Marshaler.payloadSingleResponse(result)
  }

  async deleteById(appId, loracloudDASId) {
    const result = await this._api.Delete({
      routeParams: {
        'application_ids.application_id': appId,
        loracloudDAS_id: loracloudDASId,
      },
    })

    return Marshaler.payloadSingleResponse(result)
  }

  async getFormats() {
    const result = await this._api.GetFormats()

    return Marshaler.payloadSingleResponse(result)
  }
}

export default LoracloudDASs
