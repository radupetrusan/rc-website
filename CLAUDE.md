# CLAUDE.md — Next.js Frontend

This file provides guidance to Claude Code

## Framework

This project uses **Next.js** (App Router). Follow Next.js conventions:

- Use the `app/` directory for routing and layouts
- Prefer **Server Components** by default; add `"use client"` only when interactivity or browser APIs are needed
- Use `next/image` for images and `next/link` for navigation — never plain `<img>` or `<a>` tags for internal links
- Data fetching happens in Server Components via `async/await` — avoid `useEffect` for data that can be fetched on the server

## Component Structure

Every component lives in **its own folder** named after the component (PascalCase). The folder contains only what belongs to that component:

```
ComponentName/
  ComponentName.tsx
  ComponentName.module.scss
  index.ts                     # barrel export (optional)
  hooks/                       # component-specific hooks
  data.ts                      # constants/mock data (if needed)
```

Sub-components get their own nested folders — never inline sibling components inside a parent file.

Feature domains are organized under `/src/components/<domain>/` (e.g., `seo/`, `presence/`, `reputation/`). Shared utilities within a feature go in a `common/` subfolder.

## Component Definition

Always use **arrow functions**. Never use `React.FC` or `React.FunctionComponent`.

Props are received as a single `props` parameter and **destructured on the next line** inside the function body:

```tsx
// ✅ DO
export const MyComponent = (props: MyComponentProps) => {
  const { title, description = "", onClose } = props;
  // ...
};

// ❌ DON'T
export const MyComponent: React.FC<MyComponentProps> = ({ title }) => { ... };

// ❌ DON'T
function MyComponent(props: MyComponentProps) { ... }
```

## TypeScript Props

Use `type` (not `interface`) with a `Props` suffix:

```tsx
type MyComponentProps = {
  title: string;
  description?: string;
  onClose: () => void;
};
```

- Optional props use `?`
- Default values are set during destructuring, not in the type
- Export prop types when they are needed by parent components or stories

## Imports

**Always import React hooks and utilities as named imports** — never use `React.*` namespace calls:

```tsx
// ✅ DO
import { useState, useEffect, useRef } from "react";

// ❌ DON'T
React.useState(...)
React.useEffect(...)
```

`import React from "react"` is still needed at the top of `.tsx` files for JSX.

**Path aliases** — always prefer aliases over relative paths going up more than one level:

```tsx
import { MyComponent } from "@components/seo/MyFeature/MyComponent";
import { useMyHook } from "@custom-hooks/use-my-hook/use-my-hook";
import { classNames } from "@helpers/classNames";
import { dFlex, alignItemsCenter } from "@globalStyles";
import styles from "./MyComponent.module.scss"; // local — relative is fine
```

If aliases not available you can create a new alias but dont overdo it

## Styling — SCSS Modules

All styles use **SCSS modules**. No inline styles, no global class names, no CSS-in-JS.

```tsx
import styles from "./MyComponent.module.scss";

// Usage
<div className={styles.wrapper}>
```

Use the `classNames` helper to combine multiple classes:

```tsx
import { classNames } from "@rankingcoach/vanguard";

<div className={classNames(styles.wrapper, dFlex, alignItemsCenter)}>
```

The module file name must match the component file name exactly: `MyComponent.module.scss`.

## Spacing

**Never use hardcoded pixel values** for spacing (margin, gap, padding, border, border-radius, etc.). Always use the spacing variables from `@styles/spacings`:

```scss
@import "@styles/spacings";

.card {
  padding: $x1;
  gap: $x3;
  border-radius: $x2;
}
```

x1 = 8px the rest can be calculated

## Colors

**Never use hardcoded color values** (no hex, no rgb/rgba, no named colors). Use CSS custom properties:

All the colors can be found in direct-channel.css

```scss
// ✅ DO
color: var(--n700);
background: var(--fn-bg);
border-color: var(--p500);

// ❌ DON'T
color: #333;
background: white;
```

Color families:

- `--p*` — Primary
- `--e*` — Error/Danger
- `--w*` — Warning
- `--s*` — Success
- `--a1*`, `--a2*`, `--a3*`, `--a4*` — Accent colors
- `--n*` — Neutral (e.g., `--n100` lightest → `--n900` darkest)
- `--fn-bg`, `--fn-fg`, `--fn-fg-lightest` — Functional/semantic tokens

In TypeScript, when returning a color string (e.g., for inline style or a prop), use the `var(--*)` syntax:

```tsx
return "var(--e500)";
```

## Component Library — Vanguard

**Always prefer Vanguard components** over building from scratch or using MUI directly. Import from `"vanguard"`.

**Before using any Vanguard component, use the Vanguard MCP tools** to look up the correct props, available variants, and usage examples. This prevents guessing APIs and avoids runtime errors:

- `search_components` — find components by name or keyword
- `get_component_details` — get the full props interface and available stories
- `get_component_examples` — get real code examples from Storybook
- `search_hooks` / `get_hook_details` — look up Vanguard hooks
- `search_helpers` / `get_helper_details` — look up Vanguard helpers

Import from `"@rankingcoach/vanguard"`:

```tsx
import {
  ComponentContainer,
  Button,
  ButtonTypes,
  ButtonSizes,
  Icon,
  IconNames,
  Text,
  TextTypes,
  ProgressBar,
  Tabs,
  TabProps,
  Accordion,
  PageSection,
  Popover,
  DrawerService,
  ModalService,
} from "@rankingcoach/vanguard";
```

For modals and drawers, use the **service pattern** — do not mount them conditionally in JSX, before createing a drawer/modal make sure there is a drawer/modal root, if not create it:

```tsx
const handleOpenDrawer = () => {
  const id = DrawerService.open(
    <MyDrawer onClose={() => DrawerService.close(id)} />,
    {
      showCloseButton: true,
      anchor: "right",
      variant: "temporary",
    },
  );
};
```

## Custom Hooks

Custom hooks live in `/src/custom-hooks/` and are named with the `use` prefix in camelCase. Each hook has its own folder matching the file name, if you want to create a common custom hook you should create it there:

```
/custom-hooks/use-my-hook/use-my-hook.ts
```

Hooks return either an object of named values or a single function — never a bare array tuple unless following an established React convention (e.g., `[value, setValue]`).

## File Naming

| Artifact          | Convention               |
| ----------------- | ------------------------ |
| Component files   | `PascalCase.tsx`         |
| Style modules     | `PascalCase.module.scss` |
| Test files        | `PascalCase.spec.tsx`    |
| Story files       | `PascalCase.stories.tsx` |
| Custom hooks      | `use-kebab-case.ts`      |
| Utility functions | `camelCase.ts`           |
| Type-only files   | `camelCase.types.ts`     |
| Data/constants    | `data.ts`                |

## Barrel Exports

Use `index.ts` barrel files sparingly — only when a folder's contents are imported from multiple different locations. Export both the component and its props type:

```ts
export { MyComponent } from "./MyComponent";
export type { MyComponentProps } from "./MyComponent";
```
