import { SchedulerServiceTaskScheduleDefinitionConfig } from "@backstage/backend-plugin-api/index";
import { entity_Backend } from "@kusionstack/kusion-api-client-sdk";
import { ResourceEntity } from "@backstage/catalog-model";
export type KusionProviderConfig = {
  /**
   * The base URL of the Kusion Server API endpoint.
   */
  baseUrl: string;
  /**
   * Optional schedule configuration for how often the provider should refresh data.
   */
  schedule?: SchedulerServiceTaskScheduleDefinitionConfig;
}

export type KusionBackendEntityTransformer = (
  entity: entity_Backend,
) => Promise<ResourceEntity>;
