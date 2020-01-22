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

import { createRequestActions } from './lib'

export const GET_LORACLOUDDAS_BASE = 'GET_LORACLOUDDAS'
export const [
  { request: GET_LORACLOUDDAS, success: GET_LORACLOUDDAS_SUCCESS, failure: GET_LORACLOUDDAS_FAILURE },
  { request: getLoracloudDAS, success: getLoracloudDASSuccess, failure: getLoracloudDASFailure },
] = createRequestActions(
  GET_LORACLOUDDAS_BASE,
  (appId, loracloudDASId, deviceId) => ({ appId, loracloudDASId, deviceId }),
  (appId, loracloudDASId, deviceId, selector) => ({ selector }),
)

export const GET_LORACLOUDDASS_LIST_BASE = 'GET_LORACLOUDDASS_LIST'
export const [
  {
    request: GET_LORACLOUDDASS_LIST,
    success: GET_LORACLOUDDASS_LIST_SUCCESS,
    failure: GET_LORACLOUDDASS_LIST_FAILURE,
  },
  { request: getLoracloudDASsList, success: getLoracloudDASsListSuccess, failure: getLoracloudDASsListFailure },
] = createRequestActions(GET_LORACLOUDDASS_LIST_BASE, (appId, deviceId) => ({ appId, deviceId }))
