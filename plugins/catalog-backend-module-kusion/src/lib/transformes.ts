import type { KusionBackendEntityTransformer } from '../processors';
import { type entity_Backend } from '@kusionstack/kusion-api-client-sdk';
import { ResourceEntity, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { KUSION_BACKEND_ID_ANNOTATION, KUSION_BACKEND_TYPE_ANNOTATION } from './constants';


export const defaultKusionBackendEntityTransformer: KusionBackendEntityTransformer = 
  async (backend: entity_Backend): Promise<ResourceEntity> => {
    return {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'Resource',
      metadata: {
        name: backend.name ?? '',
        description: backend.description,
        namespace: DEFAULT_NAMESPACE,
        annotations: {
          [KUSION_BACKEND_ID_ANNOTATION]: backend.id?.toString() ?? '',
          [KUSION_BACKEND_TYPE_ANNOTATION]: backend.backendConfig?.type ?? '',
        },
      },
      spec: {
        type: 'kusion-backend',
        owner: 'kusion',
      }
    }
  }
