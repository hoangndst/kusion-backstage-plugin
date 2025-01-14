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
import { configKusionApi } from '../../api';
import {
  WorkspaceService,
  DeleteWorkspaceData,
} from '@kusionstack/kusion-api-client-sdk';
import { examples } from './deleteWorkspace.example';

/**
 * Creates a `kusion:workspace:delete` Scaffolder action.
 *
 * @public
 */
export function createDeleteWorkspaceAction(options: { config: Config }) {
  const { config } = options;
  return createTemplateAction<{
    id: string;
  }>({
    id: 'kusion:workspace:delete',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            title: 'Workspace ID',
            type: 'string',
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
      const { id } = ctx.input;
      configKusionApi({ configApi: config });

      ctx.logger.info('Deleting workspace with ID: %s', id);

      const request: DeleteWorkspaceData = {
        path: {
          workspaceID: Number(id),
        },
      };

      const response = await WorkspaceService.deleteWorkspace(request);

      if (!response.data?.success) {
        ctx.logger.error(`
            Unable to delete workspace, ${response.data?.message}`);
        ctx.output('success', response.data?.success);
        ctx.output('message', response.data?.message);
        ctx.output('data', JSON.stringify(response.data?.data));
        throw new Error(
          `Unable to delete workspace, ${response.data?.message}`,
        );
      }

      ctx.logger.info('Workspace deleted successfully');
      ctx.output('success', response.data?.success);
      ctx.output('message', response.data?.message);
      ctx.output('data', response.data?.data);
    },
  });
}
