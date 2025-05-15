/*
 * Copyright 2025 KusionStack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Config } from '@backstage/config';
import { client } from '@kusionstack/kusion-api-client-sdk';

type Options = {
  configApi: Config;
};

export const configKusionApi = (option: Options) => {
  const { configApi } = option;
  const getApiUrl = () => {
    const kusionBaseUrl = configApi.getOptionalString('kusion.baseUrl');
    if (!kusionBaseUrl) {
      throw new Error('backstage config kusion.baseUrl is required');
    }

    return kusionBaseUrl;
  };

  client.setConfig({
    baseUrl: getApiUrl(),
  });
};
