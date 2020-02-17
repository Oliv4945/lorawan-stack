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

import { GET_LORACLOUDDAS, GET_LORACLOUDDAS_SUCCESS, GET_LORACLOUDDASS_LIST_SUCCESS } from '../actions/loracloudDASs'
import { getLoracloudDASId } from '../../../lib/selectors/id'

const defaultState = {
  selectedLoracloudDAS: null,
  totalCount: undefined,
  entities: {},
}

const loracloudDASs = function (state = defaultState, { type, payload }) {
  switch (type) {
    case GET_LORACLOUDDAS:
      console.log("GET_LORACLOUDDAS", payload, state)
      // TODO: replace by get
      return {
        ...state,
        selectedLoracloudDAS: `${payload.deviceId}/${payload.loracloudDASId}`,
      }
    case GET_LORACLOUDDAS_SUCCESS:
      return {
        ...state,
        entities: {
          ...state.entities,
          [getLoracloudDASId(payload)]: payload,
        },
      }
    case GET_LORACLOUDDASS_LIST_SUCCESS:
      console.log([`reducer - type: ${type}`, payload, state])
      console.log(["payload.entities", payload.entities])
      return {
        ...state,
        entities: {
          ...payload.entities.reduce((acc, loracloudDAS) => {
            console.log(`reduced`, acc)
            acc[getLoracloudDASId(loracloudDAS)] = loracloudDAS
            return acc
          }, {}),
        },
        totalCount: payload.totalCount,
      }
    default:
      return state
  }
}

export default loracloudDASs
