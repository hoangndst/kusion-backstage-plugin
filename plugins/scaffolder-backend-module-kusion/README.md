# Backstage Scaffolder Backend Module for Kusion

## Overview

This plugin integrates [KusionStack](https://github.com/KusionStack/kusion) with Backstage's scaffolder backend, enabling you to create and manage Kusion backends directly from Backstage templates.

---

## Prerequisites

- A running [Kusion Server](https://github.com/KusionStack/kusion)
- A Backstage instance (see [Backstage documentation](https://backstage.io/docs/getting-started/))

---

## Installation

From your Backstage root directory, install the plugin:

```bash
yarn add --cwd packages/backend @kusionstack/plugin-scaffolder-backend-module-kusion
```

---

## Configuration

Add the following configuration to your `app-config.yaml` to specify the Kusion server endpoint:

```yaml
backend:
  kusion:
    baseUrl: 'http://localhost:3000' # Replace with your Kusion server URL
```

---

## Backend Integration

Import and register the plugin in your Backstage backend:

Edit `packages/backend/src/index.ts`:

```typescript
// Import and register the Kusion scaffolder backend module
backend.add(import('@kusionstack/plugin-scaffolder-backend-module-kusion'));
```

---

## Usage Example

### Kusion Backend Creation Template.

`kusion:backend:create`

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: create-kusion-backend
  title: Create Kusion Backend
  description: Template to create a new Kusion Backend.
spec:
  owner: KusionStack
  type: service
  steps:
    - id: createBackend
      name: Create Backend
      action: kusion:backend:create
      input:
        name: ${{ parameters.name }}
        description: ${{ parameters.description }}
        backendConfig:
          type: ${{ parameters.backendType }}
          configs: ${{ parameters.backendConfigs }}

  output:
    text:
      - title: Information
        content: |
          * success: ${{ steps.createBackend.output.success }}
          * message: ${{ steps.createBackend.output.message }}
          * data: ${{ steps.createBackend.output.data }}
```
