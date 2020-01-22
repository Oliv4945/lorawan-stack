// Copyright © 2020 The Things Network Foundation, The Things Industries B.V.
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

import * as loracloudDASs from '../../actions/loracloudDASs'

import api from '../../../api'
import createRequestLogic from './lib'

const getLoracloudDASLogic = createRequestLogic({
  type: loracloudDASs.GET_LORACLOUDDAS,
  async process({ action }) {
    const {
      payload: { appId, loracloudDASId, deviceId },
      meta: { selector },
    } = action
    return api.application.loracloudDASs.get(appId, loracloudDASId, deviceId, selector)
  },
})

async function test(appId, deviceId) {
  const resdev = await api.application.loracloudDASs.list(appId, deviceId, [])
  console.log(["resdevtest", resdev, deviceId])
  return resdev
}

const getLoracloudDASsLogic = createRequestLogic({
  type: loracloudDASs.GET_LORACLOUDDASS_LIST,
  async process({ action }) {
    const { appId } = action.payload

    // Get device list
    const devices = await api.devices.list(appId, [])

    // Associated application packages to each devices
    var application_packages = await Promise.all(devices.end_devices.map(async (device) => {
      var device_id = device.ids["device_id"]
      var application_packages_device = await api.application.loracloudDASs.list(appId, device_id, [])
      return await application_packages_device.associations
    }));
    var application_packages = application_packages.flat(1)

    return { entities: application_packages, totalCount: application_packages.length }
  },
})

export default [getLoracloudDASLogic, getLoracloudDASsLogic]
