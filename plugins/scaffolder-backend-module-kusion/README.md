## Backstage Plugin Scaffolder Backend Module Kusion

### Getting Started

You need a `Kusion Server` running. You can find the server [here](https://github.com/KusionStack/kusion).

You need to add the following to your `app-config.yaml`. For example:

```yaml
backend:
kusion:
  baseUrl: 'http://localhost:3000'
```

### From your Backstage root directory

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @kusion/backstage-plugin-scaffolder-backend-module-kusion
```

### Workspace

#### Kusion Create Workspace

The Kusion Workspace Create action that allows you to create a new Kusion Workspace from a template.

`kusion:workspace:create`

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: create-workspace
  title: Create Workspace Template
  description: A template to create a workspace
tags:
  - kusion
  - workspace
spec:
  steps:
    - id: create-workspace
      name: Create Workspace
      action: kusion:workspace:create
      input:
        name: ${{ parameters.name }}
        description: ${{ parameters.description }}
        labels: ${{ parameters.labels }}
        owners: ${{ parameters.owners }}
        backendID: ${{ parameters.backend_id }}
  output:
    text:
      - title: Workspace create status
        description: The status of workspace creation
          content: |
          Success: `${{ steps['create-workspace'].output.success }}`
          Message: `${{ steps['create-workspace'].output.message }}`
          Data: `${{ steps['create-workspace'].output.data }}`
```
