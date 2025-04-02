# Tanstack Family + tailwindcss v4 + Origin UI + better-auth

> [!WARNING]
> fork 自  [dotnize/tanstarter](https://github.com/dotnize/tanstarter)
> 开发阶段，尚未完成，仅供参考！特别是本库体积臃肿，主要是为开发方便：

- 全部shadcn UI组件
- 大量eslint, prettier plugin
- 尚未配置完成的 Jest
- 大量尚未完成，持续开发的代码

## 参考并感谢

- [dotnize/react-tanstarter(Tanstarter with Better Auth)](https://github.com/dotnize/react-tanstarter)

  以下文档修改自 dotnize/react-tanstarter

- [Better Auth with Next Example](https://better-auth.vercel.app/docs/examples/next-js)

# TanStarter

A minimal starter template for 🏝️ TanStack Start.

- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest) + [Form](https://tanstack.com/form/latest) +
[Table](https://tanstack.com/table/latest)

- [Tailwind CSS v4](https://tailwindcss.com/) + [Oringin UI](https://originui.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [Better Auth](https://www.better-auth.com/)

## Getting Started

本库改用bun作为默认包管理工具，可自行修改 `package.json`使用其他包管理。

1. Install dependencies:

   ```bash
   bun install
   ```

2. Create a `.env` file based on [`.env.example`](./.env.example).

3. Push the schema to your database with drizzle-kit:

   ```bash
   bun db push 
   ```

   https://orm.drizzle.team/docs/migrations

4. 生成 seed 数据
   ```bash
   bun seed
   ```
5. Run the development server:

   ```bash
   bun dev
   ```

   The development server should be now running at [http://localhost:3000](http://localhost:3000).

6. Build && Start:

   ```bash
   bun run build
   bun start
   ```


## Issue watchlist

- [React Compiler docs](https://react.dev/learn/react-compiler), [Working Group](https://github.com/reactwg/react-compiler/discussions) - React Compiler is still in beta. You can disable it in [app.config.ts](./app.config.ts#L15) if you prefer.
- https://github.com/TanStack/router/discussions/2863 - TanStack Start is currently in beta and may still undergo major changes.

## Auth

Better Auth is currently configured for OAuth with GitHub, Google, and Discord, but can be easily modified to use other providers.


## Goodies

#### Scripts

These scripts in [package.json](./package.json#L5) use **pnpm** by default, but you can modify them to use your preferred package manager.

- **`auth:generate`** - Regenerate the [auth db schema](./src/lib/server/schema/auth.schema.ts) if you've made changes to your Better Auth [config](./src/lib/server/auth.ts).
- **`db`** - Run drizzle-kit commands. (e.g. `pnpm db push` to generate a migration)
- **`ui`** - The shadcn/ui CLI. (e.g. `pnpm ui add button` to add shadcn@canary button component) 注意：本库使用Origin UI 覆盖了 Shadcn UI，此方法安装可能会有冲突。
- **`format`** and **`lint`** - Run Prettier and ESLint.
- **`数据库通用工具`** - [utils.ts](app/lib/drizzle/utils.ts)
- **`zod验证库辅助函数及示例`** - [tips.org](tips.org)

#### Utilities

- [`auth-guard.ts`](./src/lib/middleware/auth-guard.ts) - Sample middleware for forcing authentication on server functions. ([see #5](https://github.com/dotnize/tanstarter/issues/5))
- [`ThemeToggle.tsx`](./src/lib/components/ThemeToggle.tsx) - A simple component to toggle between light and dark mode. ([#7](https://github.com/dotnize/tanstarter/issues/7))

