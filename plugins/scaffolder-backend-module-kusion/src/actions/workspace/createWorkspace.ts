/*
 * Copyright 2024 The Backstage Authors
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
import { createKusionApi } from '../../api';
import { examples } from './createWorkspace.example';

/**
 * Creates an `kusion:workspace:create` Scaffolder action.

 * @public
 */
export function createCreateWorkspaceAction(options: { config: Config }) {
  const { config } = options;
  return createTemplateAction<{
    name: string;
    description: string;
    labels: string[];
    owners: string[];
    backendID: number;
  }>({
    id: 'kusion:workspace:create',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['name', 'owners', 'backendID'],
        properties: {
          name: {
            title: 'Workspace Name',
            type: 'string',
          },
          description: {
            title: 'Workspace Description',
            type: 'string',
          },
          labels: {
            title: 'Workspace Labels',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          owners: {
            title: 'Workspace Owners',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          backendID: {
            title: 'Backend ID',
            type: 'number',
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
      const { name, description, labels, owners, backendID } = ctx.input;
      const kusionApi = createKusionApi({ configApi: config });
      const requestBody = {
        name,
        description,
        labels,
        owners,
        backendID,
      };

      ctx.logger.info(
        'Creating workspace with the following request body: ',
        requestBody,
      );

      const response = await kusionApi.post('workspaces', requestBody);

      if (!response.success || response.data === undefined) {
        ctx.logger.error(`
          Unable to create workspace, ${response.message}`);
        ctx.output('success', response.success);
        ctx.output('message', response.message);
        ctx.output('data', '{}');
        throw new Error(`Unable to create workspace, ${response.message}`);
      }
      ctx.logger.info('Workspace created successfully');
      ctx.output('success', response.success);
      ctx.output('message', response.message);
      ctx.output('data', JSON.stringify(response.data));
    },
  });
}
