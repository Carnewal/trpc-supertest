# trpc-supertest

[WIP] A trpc link for supertest requests


## Usage

```typescript
import { createTRPCClient } from '@trpc/client'
import { supertestLink } from "@carnewal/trpc-supertest" // Package does not exist on NPM yet.
import { AppRouter } from './trpc'
import express from 'express'

const app = express()

const trpcTestClient = createTRPCClient<AppRouter>({
    links: [supertestLink(app, { trpcPath: '/api/v1/trpc', headers: { Authorization: 'Bearer token' } })],
})

// await trpcTestClient.query.[...]
```