import { createCreateBackendAction } from './createBackend';
import { Config } from '@backstage/config';
import { BackendService } from '@kusionstack/kusion-api-client-sdk';

jest.mock('../../api', () => ({
  configKusionApi: jest.fn(),
}));
jest.mock('@kusionstack/kusion-api-client-sdk', () => ({
  BackendService: {
    createBackend: jest.fn(),
  },
}));

describe('createCreateBackendAction', () => {
  const mockConfig = { get: jest.fn() } as unknown as Config;
  const action = createCreateBackendAction({ config: mockConfig });
  const input = {
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
  };

  let ctx: any;

  beforeEach(() => {
    ctx = {
      input,
      logger: { info: jest.fn(), error: jest.fn() },
      output: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should create backend successfully', async () => {
    (BackendService.createBackend as jest.Mock).mockResolvedValue({
      data: { success: true, message: 'Created', data: { id: 1 } },
    });

    await action.handler(ctx);

    expect(BackendService.createBackend).toHaveBeenCalledWith({
      body: {
        name: input.name,
        description: input.description,
        backendConfig: input.backendConfig,
      },
    });
    expect(ctx.output).toHaveBeenCalledWith('success', true);
    expect(ctx.output).toHaveBeenCalledWith('message', 'Created');
    expect(ctx.output).toHaveBeenCalledWith('data', JSON.stringify({ id: 1 }));
  });

  it('should handle backend creation failure', async () => {
    (BackendService.createBackend as jest.Mock).mockResolvedValue({
      data: { success: false, message: 'Failed', data: { error: 'reason' } },
    });

    await expect(action.handler(ctx)).rejects.toThrow(
      'Unable to create backend, Failed',
    );
    expect(ctx.output).toHaveBeenCalledWith('success', false);
    expect(ctx.output).toHaveBeenCalledWith('message', 'Failed');
    expect(ctx.output).toHaveBeenCalledWith(
      'data',
      JSON.stringify({ error: 'reason' }),
    );
  });
});
