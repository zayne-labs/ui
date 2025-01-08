# @zayne-labs/ui-react

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
