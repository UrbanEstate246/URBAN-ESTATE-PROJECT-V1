# Netlify Functions

Serverless API endpoints. Each file exports a handler function.

Example:
```typescript
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello' }),
  };
};
```
