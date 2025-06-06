/*
 * Copyright 2025 KusionStack
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
