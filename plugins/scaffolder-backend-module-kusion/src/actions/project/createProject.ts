import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';
import { configKusionApi } from '../../api';
import {
  ProjectService,
  CreateProjectData,
} from '@kusionstack/kusion-api-client-sdk';
import { examples } from './createProject.example';

/**
 * Creates an `kusion:project:create` Scaffolder action.

 * @public
 */
export function createCreateProjectAction(options: { config: Config }) {
  const { config } = options;
  return createTemplateAction<{
    domain: string;
    name: string;
    description: string;
    labels: string[];
    owners: string[];
    organizationID: number;
    path: string;
    sourceID: number;
  }>({
    id: 'kusion:project:create',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['domain'],
        properties: {
          domain: {
            title: 'Project Domain',
            type: 'string',
          },
          name: {
            title: 'Project Name',
            type: 'string',
          },
          description: {
            title: 'Project Description',
            type: 'string',
          },
          labels: {
            title: 'Project Labels',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          owners: {
            title: 'Project Owners',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          organizationID: {
            title: 'Organization ID',
            type: 'number',
          },
          path: {
            title: 'Project Path',
            type: 'string',
          },
          sourceID: {
            title: 'Source ID',
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
      const {
        domain,
        name,
        description,
        labels,
        owners,
        organizationID,
        path,
        sourceID,
      } = ctx.input;
      configKusionApi({ configApi: config });
      const requestBody: CreateProjectData = {
        body: {
          domain,
          name,
          description,
          labels,
          owners,
          organizationID,
          path,
          sourceID,
        },
      };
      ctx.logger.info(
        'Creating project with the following request body: ',
        requestBody,
      );
      const response = await ProjectService.createProject(requestBody);

      if (!response.data?.success) {
        ctx.logger.error(`
          Unable to create project, ${response.data?.message}`);
        ctx.output('success', response.data?.success);
        ctx.output('message', response.data?.message);
        ctx.output('data', '{}');
        throw new Error(`Unable to create project, ${response.data?.message}`);
      }
      ctx.logger.info('Project created successfully');
      ctx.output('success', response.data?.success);
      ctx.output('message', response.data?.message);
      ctx.output('data', JSON.stringify(response.data?.data));
    },
  });
}
