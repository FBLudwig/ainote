# AI Note

## Project Structure

This project uses npm workspaces.

## Setup Instructions

### Prerequisites

Have Docker and Node installed.

### Initial Setup

```bash
# install dependencies in both workspaces
npm install

# create the root .env file
cp .env.example .env

# create the web .env file
cp ./web/.env.example ./web/.env

# create the api .env file
cp ./api/.env.example ./api/.env
```

Get an API key from OpenAI and set the `OPENAI_API_KEY` variable in ./api/.env
The api project uses [AI SDK](https://ai-sdk.dev/). Other AI providers are possible but need to be installed first.

### Local Development

```bash
# run the Postgres db in the background
docker compose up postgres -d

# start the api dev server
npm run dev -w api

# start the web dev server
npm run dev -w web
```

## Tech stack decisions

### Libraries

- Vite + React: simple, modern way of developing a React app
- Tailwind CSS and Shadcn: consistent UI, accessible, fast development, easily customizable
- TanStack Query: less boilerplate, simplifies loading and error states, easy to refetch stale data
- React Hook Form: less boilerplate, handles errors and validation, manages form state
- Drizzle ORM: lightweight, relatively simple API similar to SQL, handles migrations
- AI SDK: unified API, (mostly) independent of the AI model provider which makes it easy to switch

## Trade-offs and assumptions

### Client-side Routing

I decided not to use different routes and instead keep everything on one page. Create and Edit forms are handled via dialogs. I prefer the UX over navigating back and forth and it simplifies the code since no routing is needed.

### AI Summary and Tags User Flow

Instead of populating/updating the summary and tags fields on a note when it gets saved to the database, I decided to populate the form fields based on the values of the title and content form fields.
This allows the user to review the generated texts and make changes, manually fill out those fields if the AI provider is not reachable and regenerate the summary and tags easily. It also simplifies the architecture since the frontend doesn't need to be notified that summary or tags have been created in the background to update the list view. For that I would need to implement Server Sent Events or long polling and a more complicated loading state.

The requests to the AI provider are made through the backend API to not expose the API key.

### Tags

Tags are stored as a comma-separated string, and also entered as such in the form field, which makes it trivial to implement.
Postgres can do array types but I prefer to stay database agnostic.
If tags were also used for filtering or search, they should get their own database table.

### Express Project Structure

The goal is to strike a balance between simplicity and extensibility. I use a service and a data layer with repositories. By leveraging dependency injection, this allows me to easily inject a different AI model or switch out the notes repository for a mock implementation during testing.
I did not implement proper controllers or a router to keep things simple.

## What you would improve with more time

- sanitize user input and AI output
- shared types between backend and frontend
- infinite scroll, "Load more" or pagination for the notes list
- Logging
- Unit/Integration/E2E Tests
- Production setup
  - serve frontend bundle from Express backend or host on a CDN to reduce load on backend and for better performance and scalability
  - make CORS origin configurable
  - setup CI/CD
- Prompt caching: since the note title and content are usually the same for generating summary and tags, we might be able to generate both with a single prompt or use caching features of the AI model providers
- Additional features: deleting, pinning and reordering notes, assigning colors, tag filtering, (AI) search, Markdown support
