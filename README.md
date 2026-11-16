# Alam Mobility

Install dependencies with `pnpm install`, then run `pnpm dev` from the repository root.

- `pnpm lint`, `pnpm typecheck`, and `pnpm build` verify the workspace.
- `pnpm preview` builds and runs the Next.js app locally in the Cloudflare Workers runtime.
- `pnpm deploy` builds and deploys the Worker using the authenticated Cloudflare account.

## Cloudflare Workers Builds

Connect this GitHub repository to the `alammobility` Worker. Use the repository root as the build directory and `main` as the production branch. Enable non-production branch previews.

- Build command: `pnpm --filter @alammobility/web worker:build`
- Deploy command: `pnpm --filter @alammobility/web exec opennextjs-cloudflare deploy`
- Preview command: `pnpm --filter @alammobility/web exec wrangler preview`

This branch verifies the Cloudflare Workers preview pipeline.

