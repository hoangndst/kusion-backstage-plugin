import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Create a project in Kusion',
    example: yaml.stringify({
      steps: [
        {
          id: 'create-project',
          action: 'kusion:project:create',
          name: 'Create Project',
          input: {
            domain: 'http://localhost:3000',
            name: 'my-workspace',
            description: 'This is my project',
            labels: ['label1', 'label2'],
            owners: ['owner1', 'owner2'],
            organizationID: 1,
            path: '/project/tdt',
            sourceID: 1,
          },
        },
      ],
    }),
  },
];
