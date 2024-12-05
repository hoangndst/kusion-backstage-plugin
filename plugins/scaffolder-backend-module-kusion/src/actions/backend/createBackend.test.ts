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

import { createCreateBackendAction } from './createBackend';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';

jest.mock('../../api', () => ({
  createKusionApi: jest.fn(),
}));

describe('createCreateBackendAction', () => {
  const config = new ConfigReader({});
  const action = createCreateBackendAction({ config });

  it('should create a backend successfully', async () => {
    const mockContext = createMockActionContext({
      input: {
        name: 'test-backend',
        description: 'A test backend',
        backendConfig: {
          type: 'exampleType',
          configs: {
            key1: 'value1',
            key2: 'value2',
          },
        },
      },
    });

    const mockKusionApi = {
      post: jest.fn().mockResolvedValue({
        success: true,
        message: 'Backend created successfully',
        data: { id: 'backend-id' },
      }),
    };

    require('../../api').createKusionApi.mockReturnValue(mockKusionApi);

    await action.handler(mockContext);

    expect(mockKusionApi.post).toHaveBeenCalledWith('backends', {
      name: 'test-backend',
      description: 'A test backend',
      backendConfig: {
        type: 'exampleType',
        configs: {
          key1: 'value1',
          key2: 'value2',
        },
      },
    });
    expect(mockContext.output).toHaveBeenCalledWith('success', true);
    expect(mockContext.output).toHaveBeenCalledWith(
      'message',
      'Backend created successfully',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'data',
      JSON.stringify({ id: 'backend-id' }),
    );
  });

  it('should handle failure to create a backend', async () => {
    const mockContext = createMockActionContext({
      input: {
        name: 'test-backend',
        description: 'A test backend',
        backendConfig: {
          type: 'exampleType',
          configs: {
            key1: 'value1',
            key2: 'value2',
          },
        },
      },
    });

    const mockKusionApi = {
      post: jest.fn().mockResolvedValue({
        success: false,
        message: 'Failed to create backend',
      }),
    };

    require('../../api').createKusionApi.mockReturnValue(mockKusionApi);

    await expect(action.handler(mockContext)).rejects.toThrow(
      'Unable to create backend, Failed to create backend',
    );

    expect(mockKusionApi.post).toHaveBeenCalledWith('backends', {
      name: 'test-backend',
      description: 'A test backend',
      backendConfig: {
        type: 'exampleType',
        configs: {
          key1: 'value1',
          key2: 'value2',
        },
      },
    });
    expect(mockContext.output).toHaveBeenCalledWith('success', false);
    expect(mockContext.output).toHaveBeenCalledWith(
      'message',
      'Failed to create backend',
    );
    expect(mockContext.output).toHaveBeenCalledWith('data', '{}');
  });
});
