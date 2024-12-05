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

import { createCreateWorkspaceAction } from './createWorkspace';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';

jest.mock('../../api', () => ({
  createKusionApi: jest.fn(),
}));

describe('createCreateWorkspaceAction', () => {
  const config = new ConfigReader({});
  const action = createCreateWorkspaceAction({ config });

  it('should create a workspace successfully', async () => {
    const mockContext = createMockActionContext({
      input: {
        name: 'test-workspace',
        description: 'A test workspace',
        labels: ['test', 'workspace'],
        owners: ['owner1'],
        backendID: 1,
      },
    });

    const mockKusionApi = {
      post: jest.fn().mockResolvedValue({
        success: true,
        message: 'Workspace created successfully',
        data: { id: 'workspace-id' },
      }),
    };

    require('../../api').createKusionApi.mockReturnValue(mockKusionApi);

    await action.handler(mockContext);

    expect(mockKusionApi.post).toHaveBeenCalledWith('workspaces', {
      name: 'test-workspace',
      description: 'A test workspace',
      labels: ['test', 'workspace'],
      owners: ['owner1'],
      backendID: 1,
    });
    expect(mockContext.output).toHaveBeenCalledWith('success', true);
    expect(mockContext.output).toHaveBeenCalledWith(
      'message',
      'Workspace created successfully',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'data',
      JSON.stringify({ id: 'workspace-id' }),
    );
  });

  it('should handle failure to create a workspace', async () => {
    const mockContext = createMockActionContext({
      input: {
        name: 'test-workspace',
        description: 'A test workspace',
        labels: ['test', 'workspace'],
        owners: ['owner1'],
        backendID: 1,
      },
    });

    const mockKusionApi = {
      post: jest.fn().mockResolvedValue({
        success: false,
        message: 'Failed to create workspace',
      }),
    };

    require('../../api').createKusionApi.mockReturnValue(mockKusionApi);

    await expect(action.handler(mockContext)).rejects.toThrow(
      'Unable to create workspace, Failed to create workspace',
    );

    expect(mockKusionApi.post).toHaveBeenCalledWith('workspaces', {
      name: 'test-workspace',
      description: 'A test workspace',
      labels: ['test', 'workspace'],
      owners: ['owner1'],
      backendID: 1,
    });
    expect(mockContext.output).toHaveBeenCalledWith('success', false);
    expect(mockContext.output).toHaveBeenCalledWith(
      'message',
      'Failed to create workspace',
    );
    expect(mockContext.output).toHaveBeenCalledWith('data', '{}');
  });
});
