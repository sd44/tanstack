# Tanstack Start with Query + tailwindcss v4 + shadcn UI + better-auth

> [!WARNING]
> fork 自  [dotnize/tanstarter](https://github.com/dotnize/tanstarter)
> 开发阶段，尚未完成，仅供参考！特别是本库体积臃肿，主要是为开发方便：

- 全部shadcn UI组件
- 大量eslint, prettier plugin
- 尚未配置完成的 Jest
- 大量尚未完成，持续开发的代码

## 参考并感谢

- [dotnize/tanstarter(Tanstack with Better)](https://github.com/dotnize/tanstarter)
  
  以下文档基本源自 dotnize/tanstarter

- [Better Auth with Next Example](https://better-auth.vercel.app/docs/examples/next-js)

# TanStarter

A minimal starter template for 🏝️ TanStack Start.

- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest) + [Form](https://tanstack.com/form/latest)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [Better Auth](https://www.better-auth.com/)

## Getting Started

1. [Use this template](https://github.com/new?template_name=tanstarter&template_owner=dotnize) or clone this repository.

2. Install dependencies:

   ```bash
   pnpm install # npm install
   ```

3. Create a `.env` file based on [`.env.example`](./.env.example).

4. Push the schema to your database with drizzle-kit:

   ```bash
   pnpm db push # npm run db push
   ```

   https://orm.drizzle.team/docs/migrations

5. Run the development server:

   ```bash
   pnpm dev # npm run dev
   ```

   The development server should be now running at [http://localhost:3000](http://localhost:3000).

## Issue watchlist

- [React Compiler docs](https://react.dev/learn/react-compiler), [Working Group](https://github.com/reactwg/react-compiler/discussions) - React Compiler is still in beta. You can disable it in [app.config.ts](./app.config.ts#L15) if you prefer.
- https://github.com/TanStack/router/discussions/2863 - TanStack Start is currently in beta and may still undergo major changes.
- https://github.com/shadcn-ui/ui/discussions/6714 - We're using the `canary` version of shadcn/ui for Tailwind v4 support.

## Auth

Better Auth is currently configured for OAuth with GitHub, Google, and Discord, but can be easily modified to use other providers.


## Goodies

#### Scripts

These scripts in [package.json](./package.json#L5) use **pnpm** by default, but you can modify them to use your preferred package manager.

- **`auth:generate`** - Regenerate the [auth db schema](./src/lib/server/schema/auth.schema.ts) if you've made changes to your Better Auth [config](./src/lib/server/auth.ts).
- **`db`** - Run drizzle-kit commands. (e.g. `pnpm db push` to generate a migration)
- **`ui`** - The shadcn/ui CLI. (e.g. `pnpm ui add button` to add the button component)
- **`format`** and **`lint`** - Run Prettier and ESLint.

#### Utilities

- [`auth-guard.ts`](./src/lib/middleware/auth-guard.ts) - Sample middleware for forcing authentication on server functions. ([see #5](https://github.com/dotnize/tanstarter/issues/5))
- [`ThemeToggle.tsx`](./src/lib/components/ThemeToggle.tsx) - A simple component to toggle between light and dark mode. ([#7](https://github.com/dotnize/tanstarter/issues/7))

## Building for production

Read the [hosting docs](https://tanstack.com/start/latest/docs/framework/react/hosting) for information on how to deploy your TanStack Start app.


- [nekochan0122/tanstack-boilerplate](https://github.com/nekochan0122/tanstack-boilerplate) - A batteries-included TanStack Start boilerplate that inspired some patterns in this template. If you're looking for a more feature-rich starter, check it out!
- [AlexGaudon/tanstarter-better-auth](https://github.com/AlexGaudon/tanstarter-better-auth) for his own better-auth implementation.


