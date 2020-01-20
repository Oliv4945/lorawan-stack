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
      payload: { appId, loracloudDASId },
      meta: { selector },
    } = action
    return api.application.loracloudDASs.get(appId, loracloudDASId, selector)
  },
})

const getLoracloudDASsLogic = createRequestLogic({
  type: loracloudDASs.GET_LORACLOUDDASS_LIST,
  async process({ action }) {
    const { appId } = action.payload
    // OGZ test
    console.log("GET_LORACLOUDDASS_LIST")
    /*
        const devices = await api.devices.list(appId, [])
        console.log(devices)
        var res = {
          associations: [],
          totalCount: 0
        }
        console.log("GET_LORACLOUDDASS_LIST 2")
        devices.end_devices.forEach(device => {
          console.log(device)
          console.log(device.ids)
          console.log(device.ids["device_id"])
          var device_id = device.ids["device_id"]
          console.log(`DEvice_id: ${device_id}`)
          api.application.loracloudDASs.list(appId, device_id, []).then(function (res_device) {
            console.log(["res_device", res])
            res.associations.push.apply(res.associations, res_device.associations)
            // OGZ Why + 1
            res.totalCount += res_device.totalCount + 1
          })
        });
    */
    console.log("END GET_LORACLOUDDASS_LIST")
    const res = await api.application.loracloudDASs.list(appId, 'test-device', [])
    console.log(["res", res])
    console.log("END GET_LORACLOUDDASS_LIST 2")
    return { entities: res.associations, totalCount: res.totalCount }
  },
})

export default [getLoracloudDASLogic, getLoracloudDASsLogic]
