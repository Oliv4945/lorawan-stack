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

    const devices = await api.devices.list(appId, [])
    console.log(["getLoracloudDASsLogic - devices", devices.end_devices])
    var res = {
      associations: [],
      totalCount: 0
    }


    devices.end_devices.forEach(device => {
      var device_id = device.ids["device_id"]
      console.log(`Device_id: ${device_id}`)
      api.application.loracloudDASs.list(appId, device_id, []).then(function (res_device) {
        console.log(["res_device", res_device, device_id])
        res.associations.push.apply(res.associations, res_device.associations)
        res.totalCount += res_device.totalCount
      })
    });

    //const res = await api.application.loracloudDASs.list(appId, 'test-device', [])
    console.log(["getLoracloudDASsLogic res", { entities: res.associations, totalCount: res.totalCount }])
    return { entities: res.associations, totalCount: res.totalCount }
  },
})

export default [getLoracloudDASLogic, getLoracloudDASsLogic]
