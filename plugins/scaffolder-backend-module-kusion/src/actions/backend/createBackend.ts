import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';
import { createKusionApi } from '../../api';
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
      const kusionApi = createKusionApi({ configApi: config });
      const requestBody = {
        name,
        description,
        backendConfig,
      };

      ctx.logger.info(
        'Creating backend with the following request body: ',
        requestBody,
      );

      const response = await kusionApi.post('backends', requestBody);

      if (!response.success || response.data === undefined) {
        ctx.logger.error(`
          Unable to create backend, ${response.message}`);
        ctx.output('success', response.success);
        ctx.output('message', response.message);
        ctx.output('data', '{}');
        throw new Error(`Unable to create backend, ${response.message}`);
      }

      ctx.logger.info('Backend created successfully');
      ctx.output('success', response.success);
      ctx.output('message', response.message);
      ctx.output('data', JSON.stringify(response.data));
    },
  });
}
