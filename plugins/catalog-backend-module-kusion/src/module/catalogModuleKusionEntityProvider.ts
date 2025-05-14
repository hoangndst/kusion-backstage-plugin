import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { KusionBackendEntityProvider } from '../providers/KusionBackendEntityProvider';

export const catalogModuleKusionEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'kusion-entity-provider',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ config, catalog, logger, scheduler }) {
        const entityProvider = KusionBackendEntityProvider.fromConfig(config, {
          logger,
          scheduler,
        });
        catalog.addEntityProvider(entityProvider);
      },
    });
  },
});
