import { SchedulerServiceTaskScheduleDefinitionConfig } from '@backstage/backend-plugin-api';

export interface Config {
  catalog?: {
    /**
     * Configuration for the catalog providers.
     */
    providers?: {
      /**
       * Configuration for the Kusion provider.
       */
      kusion?: {
        /**
         * The base URL of the Kusion Server API endpoint.
         */
        baseUrl: string;
        /**
         * Optional schedule configuration for how often the provider should refresh data.
         */
        schedule?: SchedulerServiceTaskScheduleDefinitionConfig;
      }
    }
  }
}
