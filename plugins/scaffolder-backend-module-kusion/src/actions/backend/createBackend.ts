import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';
import { configKusionApi } from '../../api';
import {
  BackendService,
  CreateBackendData,
} from '@kusionstack/kusion-api-client-sdk';
import { examples } from './createBackend.example';

/**
 * Creates a `kusion:backend:create` Scaffolder action.
 *
 * @public
 */
export function createCreateBackendAction(options: { config: Config }) {
  const { config } = options;
  return createTemplateAction<{
    name: string;
    description: string;
    backendConfig: {
      type: string;
      configs: Record<string, string>;
    };
  }>({
    id: 'kusion:backend:create',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['name', 'backendConfig'],
        properties: {
          name: {
            title: 'Backend Name',
            type: 'string',
          },
          description: {
            title: 'Backend Description',
            type: 'string',
          },
          backendConfig: {
            title: 'Backend Configuration',
            type: 'object',
            required: ['type', 'configs'],
            properties: {
              type: {
                title: 'Backend Type',
                type: 'string',
              },
              configs: {
                title: 'Backend Configs',
                type: 'object',
                additionalProperties: {
                  type: 'string',
                },
              },
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
      const { name, description, backendConfig } = ctx.input;
      configKusionApi({ configApi: config });
      const requestBody: CreateBackendData = {
        body: {
          name: name,
          description: description,
          backendConfig: backendConfig,
        },
      };

      ctx.logger.info(
        'Creating backend with the following request body: ',
        requestBody,
      );

      const response = await BackendService.createBackend(requestBody);

      if (!response.data?.success) {
        ctx.logger.error(`
          Unable to create backend, ${response.data?.message}`);
        ctx.output('success', response.data?.success);
        ctx.output('message', response.data?.message);
        ctx.output('data', JSON.stringify(response.data?.data));
        throw new Error(`Unable to create backend, ${response.data?.message}`);
      }

      ctx.logger.info('Backend created successfully');
      ctx.output('success', response.data?.success);
      ctx.output('message', response.data?.message);
      ctx.output('data', JSON.stringify(response.data?.data));
    },
  });
}
