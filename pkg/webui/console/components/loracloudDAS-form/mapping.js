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

const mapLoracloudDASHeadersTypeToFormValue = headersType =>
  (headersType &&
    Object.keys(headersType).reduce(
      (result, key) =>
        result.concat({
          key,
          value: headersType[key],
        }),
      [],
    )) ||
  []

export const mapLoracloudDASToFormValues = loracloudDAS => ({
  loracloudDAS_id: loracloudDAS.ids.loracloudDAS_id,
  base_url: loracloudDAS.base_url,
  device_id: loracloudDAS.device_id,
  format: loracloudDAS.format,
  token: loracloudDAS.token,
  port: loracloudDAS.port,
})

const mapHeadersTypeFormValueToLoracloudDASHeadersType = formValue =>
  (formValue &&
    formValue.reduce(
      (result, { key, value }) => ({
        ...result,
        [key]: value,
      }),
      {},
    )) ||
  null

export const mapFormValuesToLoracloudDAS = function (values, appId) {
  return {
    ids: {
      application_ids: {
        application_id: appId,
      },
      loracloudDAS_id: values.loracloudDAS_id,
    },
    base_url: values.base_url,
    format: values.format,
    device_id: values.device_id,
    token: values.token,
    port: values.port,
  }
}

export const blankValues = {
  loracloudDAS_id: undefined,
  base_url: 'https://dms.loracloud.com',
  format: undefined,
  token: '',
  port: '200',
}
