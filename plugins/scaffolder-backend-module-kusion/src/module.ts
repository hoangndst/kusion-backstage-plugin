/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createCreateOrganizationAction } from './actions/organization';
import { createCreateProjectAction } from './actions/project';
import {
  createCreateWorkspaceAction,
  createDeleteWorkspaceAction,
} from './actions/workspace';
import {
  createCreateBackendAction,
  createDeleteBackendAction,
} from './actions/backend';

/**
 * The Kusion Module for the Scaffolder Backend
 * @public
 */
export const kusionModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'kusion',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ scaffolder, config }) {
        scaffolder.addActions(
          createCreateWorkspaceAction({
            config,
          }),
          createDeleteWorkspaceAction({
            config,
          }),
        );
        scaffolder.addActions(
          createCreateBackendAction({
            config,
          }),
          createDeleteBackendAction({
            config,
          }),
        );
        scaffolder.addActions(
          createCreateOrganizationAction({
            config,
          }),
        );
        scaffolder.addActions(
          createCreateProjectAction({
            config,
          }),
        );
      },
    });
  },
});
