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

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';
import { configKusionApi } from '../../api';
import {
  OrganizationService,
  CreateOrganizationData,
} from '@kusionstack/kusion-api-client-sdk';
import { examples } from './createOrganization.example';

/**
 * Creates an `kusion:organization:create` Scaffolder action.

 * @public
 */
export function createCreateOrganizationAction(options: { config: Config }) {
  const { config } = options;
  return createTemplateAction<{
    name: string;
    description: string;
    labels: string[];
    owners: string[];
  }>({
    id: 'kusion:organization:create',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['owners'],
        properties: {
          name: {
            title: 'Organization Name',
            type: 'string',
          },
          description: {
            title: 'Organization Description',
            type: 'string',
          },
          labels: {
            title: 'Organization Labels',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          owners: {
            title: 'Organization Owners',
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          success: {
            title: 'Success',
            type: 'boolean',
          },
          message: {
            title: 'Message',
            type: 'string',
          },
          data: {
            title: 'Data',
            type: 'object',
          },
        },
      },
    },
    async handler(ctx) {
      const { name, description, labels, owners } = ctx.input;
      configKusionApi({ configApi: config });
      const requestBody: CreateOrganizationData = {
        body: {
          name: name,
          description: description,
          labels: labels,
          owners: owners,
        },
      };
      ctx.logger.info(
        'Creating organization with the following request body: ',
        requestBody,
      );
      const response = await OrganizationService.createOrganization(
        requestBody,
      );

      if (!response.data?.success) {
        ctx.logger.error(`
          Unable to create backend, ${response.data?.message}`);
        ctx.output('success', response.data?.success);
        ctx.output('message', response.data?.message);
        ctx.output('data', JSON.stringify(response.data?.data));
        throw new Error(
          `Unable to create organization, ${response.data?.message}`,
        );
      }
      ctx.logger.info('Organization created successfully');
      ctx.output('success', response.data?.success);
      ctx.output('message', response.data?.message);
      ctx.output('data', JSON.stringify(response.data?.data));
    },
  });
}
