/*
 * Copyright 2024 KusionStack
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
import fetch, { RequestInit } from 'node-fetch';

type Options = {
  configApi: Config;
};

export const createKusionApi = (option: Options) => {
  const { configApi } = option;
  const getApiUrl = async (
    { serviceName }: { serviceName?: string },
    { params }: { params?: string } = {},
  ): Promise<string> => {
    const kusionBaseUrl = configApi.getOptionalString('kusion.baseUrl');
    if (!kusionBaseUrl) {
      throw new Error('backstage config kusion.baseUrl is required');
    }

    const proxyPath =
      configApi.getOptionalString('kusion.proxyPath') || DEFAULT_PROXY_PATH;

    let url = `${kusionBaseUrl}${proxyPath}`;

    if (serviceName) {
      url += `/${serviceName}`;
    }
    if (params) {
      url += `/${params}`;
    }

    return url.replace(/\/$/, '');
  };

  const getKusionToken = async () => {
    const token = configApi.getOptionalString('kusion.token');
    if (!Boolean(token) || token?.length === 0) {
      throw new Error('backstage config kusion.token is required');
    }
    return token;
  };

  const post = async (
    serviceName: string,
    body: any,
    params?: string,
  ): Promise<KusionResponse> => {
    try {
      const url = await getApiUrl({ serviceName }, { params });
      const requestOption: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getKusionToken()}`,
        },
        body: JSON.stringify(body),
      };

      const response = await fetch(url, requestOption);

      if (!response.ok) {
        throw new Error(
          `Failed to create ${serviceName}: ${response.statusText}`,
        );
      }

      return (await response.json()) as KusionResponse;
    } catch (error) {
      throw new Error(`Error in post request to ${serviceName}: ${error}`);
    }
  };

  const put = async (
    serviceName: string,
    body: any,
    params?: string,
  ): Promise<KusionResponse> => {
    try {
      const url = await getApiUrl({ serviceName }, { params });
      const requestOption: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getKusionToken()}`,
        },
        body: JSON.stringify(body),
      };

      const response = await fetch(url, requestOption);

      if (!response.ok) {
        throw new Error(
          `Failed to update ${serviceName}: ${response.statusText}`,
        );
      }

      return (await response.json()) as KusionResponse;
    } catch (error) {
      throw new Error(`Error in put request to ${serviceName}: ${error}`);
    }
  };

  return {
    post,
    put,
  };
};
