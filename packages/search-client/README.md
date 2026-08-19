# @tutenet/search-client

TypeScript client for the TuteNet Search Service API.

## Features

- **Unified Search** — Search resources and teachers in a single call
- **Teacher Search** — Dedicated endpoint for finding educators by name, school, subject
- **Search Suggestions** — Autocomplete with popular queries and subject matching
- **Type-safe** — Full TypeScript types for all requests and responses
- **Paginated** — Cursor-based pagination for all search results

## Installation

```bash
npm install @tutenet/search-client
```

## Usage

```typescript
import { SearchClient, Environment } from '@tutenet/search-client';

const client = new SearchClient({
  environment: Environment.STAGING,
  accessToken: 'your-jwt-token',
});

// Unified search (resources + teachers)
const unified = await client.search({ q: 'algebra', type: 'all' });

// Resources only
const resources = await client.searchResources({ q: 'math worksheet', subject: 'Mathematics' });

// Teachers only
const teachers = await client.searchTeachers({ q: 'Pankaj', subject: 'Mathematics' });

// Suggestions
const suggestions = await client.getSuggestions({ prefix: 'mat' });
```

## API

### `search(params)`
Unified search — type: 'all' | 'resources' | 'teachers'

### `searchResources(params)`
Resource-only search with filters (subject, grades, language, sort)

### `searchTeachers(params)`
Teacher search by name, school, city, subject

### `getSuggestions(params)`
Autocomplete suggestions based on prefix
