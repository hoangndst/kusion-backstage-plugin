import { Entity } from '@backstage/catalog-model';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { Config } from '@backstage/config';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { BackendService, client } from '@kusionstack/kusion-api-client-sdk';
import {
  KusionProviderConfig,
  KusionBackendEntityTransformer,
} from '../processors';
import { defaultKusionBackendEntityTransformer } from '../lib/transformes';

export class KusionBackendEntityProvider implements EntityProvider {
  private readonly config: KusionProviderConfig;
  private readonly logger: LoggerService;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;
  private readonly transformer: KusionBackendEntityTransformer;

  private constructor(
    config: KusionProviderConfig,
    taskRunner: SchedulerServiceTaskRunner,
    logger: LoggerService,
    transformer: KusionBackendEntityTransformer,
  ) {
    this.config = config;
    this.scheduleFn = this.createScheduleFn(taskRunner);
    this.logger = logger;
    this.transformer = transformer;
  }

  /**
   * Creates a provider from config.
   */
  static fromConfig(
    rootConfig: Config,
    options: {
      logger: LoggerService;
      scheduler: SchedulerService;
      transformer?: KusionBackendEntityTransformer;
    },
  ): KusionBackendEntityProvider {
    const kusionConfig = rootConfig.getConfig('catalog.providers.kusion');
    const schedule = readSchedulerServiceTaskScheduleDefinitionFromConfig(
      kusionConfig.getConfig('schedule'),
    );
    const transformer =
      options.transformer ?? defaultKusionBackendEntityTransformer;
    return new KusionBackendEntityProvider(
      {
        baseUrl: kusionConfig.getString('baseUrl'),
        schedule,
      },
      options.scheduler.createScheduledTaskRunner(schedule),
      options.logger,
      transformer,
    );
  }

  getProviderName(): string {
    return `kusion-backends`;
  }

  /**
   * Connects the provider to the catalog.
   */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
  }

  private createScheduleFn(
    taskRunner: SchedulerServiceTaskRunner,
  ): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          try {
            await this.refresh();
          } catch (error) {
            this.logger.error(
              'Error refreshing Kusion Backends',
              error as Error,
            );
          }
        },
      });
    };
  }

  /**
   * Refreshes the entities from Kusion backend.
   */
  async refresh(): Promise<void> {
    if (!this.connection) {
      throw new Error('Kusion discovery connection not initialized');
    }
    this.logger.info('Discovering Kusion Backends');
    const entities: Entity[] = [];
    client.setConfig({
      baseUrl: this.config.baseUrl,
    });
    try {
      const backends = await BackendService.listBackend();
      for (const backend of backends.data?.data?.backends ?? []) {
        if (!backend.name) {
          this.logger.warn('Skipping backend with missing name');
          continue;
        }
        const entity = await this.transformer(backend);
        if (entity) {
          entities.push(entity);
        }
      }
      this.logger.info(`Discovered ${entities.length} Kusion Backends`);
    } catch (error) {
      this.logger.error(
        'Error discovering Kusion Backends',
        error as Error,
      );
      throw error;
    }
    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        entity,
        locationKey: this.createLocationSpec(entity.metadata.name),
      })),
    });
  }

  private async createLocationSpec(id: string): Promise<LocationSpec> {
    return {
      type: 'url',
      target: `${this.config.baseUrl}/api/v1/backends/${id}`,
      presence: 'required',
    };
  }
}

