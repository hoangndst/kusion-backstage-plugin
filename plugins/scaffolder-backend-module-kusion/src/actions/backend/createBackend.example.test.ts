import { examples } from './createBackend.example';
import yaml from 'yaml';

describe('createBackend.example', () => {
  it('should export the correct example', () => {
    expect(Array.isArray(examples)).toBe(true);
    expect(examples.length).toBe(1);
    const example = examples[0];
    expect(example.description).toBe('Create a backend in Kusion');

    // Parse the YAML to verify its structure
    const parsed = yaml.parse(example.example);
    expect(parsed).toHaveProperty('steps');
    expect(Array.isArray(parsed.steps)).toBe(true);
    expect(parsed.steps[0]).toMatchObject({
      id: 'create-backend',
      action: 'kusion:backend:create',
      name: 'Create backend',
      input: {
        name: 'my-backend',
        description: 'This is my backend',
        backendConfig: {
          type: 's3',
          configs: {
            region: 'string',
            endpoint: 'string',
            accessKeyID: 'string',
            accessKeySecret: 'string',
            bucket: 'string',
            prefix: 'string',
          },
        },
      },
    });
  });
});
