# Agent Guidelines

## Essentials

- Stack: TypeScript + React (TanStack Start), with Drizzle ORM, shadcn + basecn UI, and Better Auth.
- Use shadcn CLI (`bun ui add <component>`) for adding new UI components & primitives.
- **UI Library: basecn UI** (NOT Radix UI) — see [basecn vs Radix](#basecn-ui-vs-radix-ui) for key differences.
- Use `lucide-react` for UI icons (use `Icon` suffix, e.g. `import { Loader2Icon } from "lucide-react"`)
- For TanStack libraries, consult latest docs via `bun tanstack <command>` (see [Workflow](.agents/workflow.md#tanstack-cli)).
- Don't build after every little change. If `bun lint` passes; assume changes work.

## basecn UI vs Radix UI

**Important:** This project uses **basecn UI**, not Radix UI. Key differences:

| Feature | Radix UI | basecn UI |
|---------|----------|-----------|
| **Child Rendering** | `asChild` prop + `Slot` | `render` prop + `useRender` Hook |
| **Popover Positioning** | Props on `Content` (`side`, `align`) | Use `Positioner` component wrapping `Content` |
| **Label in Popovers** | `Label` anywhere in content | `Label` must be inside `Group` |
| **Prop Naming** | Varies by component | Different prop names for same components |

### Usage Patterns

```tsx
// ✅ basecn UI: render prop
<Button render={<a href="/contact"/>}>Contact</Button>

// ✅ basecn UI: Positioner for dropdowns/popovers
<DropdownMenuPositioner side="left" align="start">
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuItem>Profile</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenuPositioner>

// ❌ Don't use Radix patterns: asChild, direct side/align on Content
```

### Migration Reference

For detailed migration guidance, see: <https://basecn.dev/docs/get-started/migrating-from-radix-ui>

## Topic-specific Guidelines

- [UI Components](.agents/ui-components.md) - **shadcn + basecn UI** patterns, Radix UI differences
- [TanStack patterns](.agents/tanstack-patterns.md) - Routing, data fetching, loaders, server functions, environment shaking
- [Auth patterns](.agents/auth.md) - Route guards, middleware, auth utilities
- [TypeScript conventions](.agents/typescript.md) - Casting rules, prefer type inference
- [Workflow](.agents/workflow.md) - Workflow commands, validation approach
