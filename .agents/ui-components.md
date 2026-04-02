# UI Components Guidelines

## Stack

This project uses **shadcn + basecn UI** as the primary UI library, NOT plain Radix UI.

```bash
# Install new components via shadcn CLI
bun ui add <component>
```

## basecn UI vs Radix UI

While the project may have `radix-ui` packages installed (as transitive dependencies or for specific components), the **preferred patterns follow basecn UI**:

| Feature | Radix UI | basecn UI |
|---------|----------|-----------|
| **Child Rendering** | `asChild` prop + `Slot` | `render` prop + `useRender` Hook |
| **Popover Positioning** | Props on `Content` (`side`, `align`, `sideOffset`) | Use `Positioner` component wrapping `Content` |
| **Label in Popovers** | `Label` can be anywhere | `Label` must be inside `Group` |
| **Prop Naming** | Varies by component | Different conventions (check docs) |

## Usage Patterns

### ✅ Correct (basecn UI)

```tsx
// Button with render prop
import { Button } from "@/components/ui/button";

<Button render={<a href="/contact" />}>Contact</Button>;

// Dropdown with Positioner
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPositioner,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuPositioner side="bottom" align="start">
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenuPositioner>
</DropdownMenu>;

// Form with Label inside Group
import {
  Dialog,
  DialogContent,
  DialogGroup,
  DialogLabel,
} from "@/components/ui/dialog";

<DialogContent>
  <DialogGroup>
    <DialogLabel>Account Settings</DialogLabel>
    {/* form fields */}
  </DialogGroup>
</DialogContent>;
```

### ❌ Incorrect (Radix UI patterns - avoid)

```tsx
// Don't use asChild
<Button asChild>
  <a href="/contact">Contact</a>
</Button>

// Don't put side/align directly on Content
<DropdownMenuContent side="bottom" align="start">
  {/* ... */}
</DropdownMenuContent>

// Don't use Label outside Group in dialogs/popovers
<DialogContent>
  <DialogLabel>Settings</DialogLabel>
  <DialogGroup>
    {/* fields */}
  </DialogGroup>
</DialogContent>
```

## Component Libraries

The project uses multiple UI libraries for different purposes:

1. **basecn UI** (`@base-ui/react`) - Primary UI components via shadcn
2. **bazza-ui** (`@bazza-ui/*`) - Extended components (dropdown-menu, filters)
3. **Radix UI** (`radix-ui`) - Some primitives (may be used internally)
4. **Headless UI** (`@headlessui/react`) - Alternative headless components
5. **React Aria** (`react-aria-components`) - Adobe's accessibility library

When adding new components:
1. First check if shadcn has it: `bun ui add <component>`
2. If not available, prefer basecn UI patterns
3. For complex components, consider bazza-ui or other libraries

## Icons

Use `lucide-react` for icons with the `Icon` suffix convention:

```tsx
import { Loader2Icon, CheckIcon } from "lucide-react";

<Loader2Icon className="h-4 w-4 animate-spin" />;
```

## References

- [basecn UI Docs](https://basecn.dev/docs/get-started/migrating-from-radix-ui)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [basecn UI Components](https://basecn.dev/components)
