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

class LoracloudDASs {
  constructor(registry) {
    this._api = registry
  }

  async getAll(appId) {
    const result = await this._api.List({
      routeParams: { 'application_ids.application_id': appId },
    })

    return Marshaler.payloadListResponse('loracloudDASs', result)
  }

  async create(
    appId,
    loracloudDAS,
    mask = Marshaler.fieldMaskFromPatch(loracloudDAS, this._api.SetAllowedFieldMaskPaths),
  ) {
    const result = await this._api.Set(
      {
        routeParams: {
          'loracloudDAS.ids.application_ids.application_id': appId,
        },
      },
      {
        loracloudDAS,
        field_mask: Marshaler.fieldMask(mask),
      },
    )

    return Marshaler.payloadSingleResponse(result)
  }

  async getById(appId, loracloudDASId, selector) {
    const fieldMask = Marshaler.selectorToFieldMask(selector)
    const result = await this._api.Get(
      {
        routeParams: {
          'ids.application_ids.application_id': appId,
          'ids.loracloudDAS_id': loracloudDASId,
        },
      },
      fieldMask,
    )

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
