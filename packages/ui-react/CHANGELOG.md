# @zayne-labs/ui-react

## 0.4.1

### Patch Changes

- 3b8918d: feat: export useFormRootContext

## 0.4.0

### Minor Changes

- c3306fa: chore(deps,form)!: 🔧 cleanup form context types and update dependencies

   feat(form)!: 🏗️ simplify form context type definitions and remove unused imports and change naming for more consistent use
   chore(config): 🔧 update prettier and package configurations

## 0.3.0

### Minor Changes

- 82512d3: feat(ui-react): add FormSubmitButton component

   - Added a `FormSubmitButton` component to the `ui-react` package.
   - This component provides a styled submit button for forms, with support for `asChild` and `unstyled` props.
   - Updated `form-parts.ts` to export the new component.
   - Added `zustand` as a dependency and devDependency to `ui-react` package.

## 0.2.3

### Patch Changes

- baad855: feat: add granular subscriptions for formstate and values

   refactor: restructure project to use workspace-based monorepo

   - Reorganized project structure to use pnpm workspace monorepo setup
   - Moved development app to apps/dev directory
   - Updated workspace configuration and dependencies
   - Set up Vite + React + TypeScript development environment
   - Added form example using @zayne-labs/ui-react components
   - Configured TailwindCSS with custom theme variables
   - Added proper TypeScript and tooling configuration
   - Removed root-level tailwind config in favor of app-specific config

   Key changes:

   - Added pnpm-workspace.yaml for monorepo setup
   - Created apps/dev directory with complete Vite app setup
   - Configured build tooling (Vite, TypeScript, TailwindCSS)
   - Added example React form implementation
   - Updated all relevant config files and dependencies

## 0.2.2

### Patch Changes

- 4dab8cf: fix type issue with for

## 0.2.1

### Patch Changes

- 2d22d3a: feat(show): add function children support and improve type safety 🎯
  feat(switch): add function children and better condition handling 🔄
  fix(exports): update import paths and remove redundant common export 🛠️
  chore(deps): bump toolkit packages to 0.8.32 and other dependencies 📦

## 0.2.0

### Minor Changes

- 88b9957: feat(exports)!: ♻️ 🔧 simplify package exports using path patterns. slot and co are now under ./common/\* pattern

   feat(components): ✨ export all components from root entry point

## 0.1.0

### Minor Changes

- f02d029: feat(form):

   - ✨ Add FormDescription component for form field descriptions
   - 🏗️ Move context logic to dedicated form-context.ts file
   - 🛠️ Add useFormFieldContext hook with better error handling
   - ♻️ Improve error message types and render prop patterns

   refactor(form): 🔄 Enhance form component architecture and API

   style(form):

   - 🎨 Rename compound component exports to use -parts suffix
   - 🔤 Update provider names for better DX

## 0.0.5

### Patch Changes

- 9f1dfce: feat(components): 🚀 Improve Show and Switch component exports and slot symbols

   feat(show): 🔍 Update ShowFallback slot symbol for better clarity

   - Change `Symbol.for("fallback")` to `Symbol.for("show-fallback")`
   - Add direct `Show` export for easier component usage

   feat(switch): 🔀 Enhance Switch component exports and default case handling

   - Update default case slot symbol to `Symbol.for("switch-default")`
   - Fix `getSlotElement` to use `SwitchDefault` instead of `Default`
   - Add direct `Switch` export for more intuitive component usage

## 0.0.4

### Patch Changes

- 038684c: Changes:

   - Standardized component paths to use lowercase naming convention
   - Removed `clsx` dependency in favor of direct `tailwind-merge` usage
   - Changed file structure for common components

   Features:

   - Added new polymorphic Card component with compound pattern
   - Optimized Slot component's children validation logic

   Performance:

   - Improved type inference in Slot component
   - Enhanced performance in Slot component by optimizing children checks

   Dependencies:

   - Removed optional peer dependency on `clsx`
   - Simplified className merging utility to use `tailwind-merge` directly

## 0.0.3

### Patch Changes

- 360a087: 🎉 feat(initial): bootstrap @zayne-labs/ui library

   ✨ Features:

   Set up monorepo structure with React UI package
   Configure build system with Vite and TSUP
   Add development environment with hot reloading
   Configure TypeScript, ESLint, and Prettier
   Set up GitHub Actions for CI/CD
   Add Tailwind CSS integration
   Configure package publishing settings
   🔧 Tooling:

   Add size-limit for bundle analysis
   Set up changesets for versioning
   Configure ESLint with React and Tailwind plugins
   Add Prettier plugins for class names and Tailwind
   📝 Documentation:

   Add comprehensive README with features and setup guide

## 0.0.2

### Patch Changes

- 71a6022: 🎉 feat(initial): bootstrap @zayne-labs/ui library

   ✨ Features:

   Set up monorepo structure with React UI package
   Configure build system with Vite and TSUP
   Add development environment with hot reloading
   Configure TypeScript, ESLint, and Prettier
   Set up GitHub Actions for CI/CD
   Add Tailwind CSS integration
   Configure package publishing settings
   🔧 Tooling:

   Add size-limit for bundle analysis
   Set up changesets for versioning
   Configure ESLint with React and Tailwind plugins
   Add Prettier plugins for class names and Tailwind
   📝 Documentation:

   Add comprehensive README with features and setup guide

## 0.0.1

### Patch Changes

- 6c0ce3e: 🎉 feat(initial): bootstrap @zayne-labs/ui library

   ✨ Features:

   Set up monorepo structure with React UI package
   Configure build system with Vite and TSUP
   Add development environment with hot reloading
   Configure TypeScript, ESLint, and Prettier
   Set up GitHub Actions for CI/CD
   Add Tailwind CSS integration
   Configure package publishing settings
   🔧 Tooling:

   Add size-limit for bundle analysis
   Set up changesets for versioning
   Configure ESLint with React and Tailwind plugins
   Add Prettier plugins for class names and Tailwind
   📝 Documentation:

   Add comprehensive README with features and setup guide
