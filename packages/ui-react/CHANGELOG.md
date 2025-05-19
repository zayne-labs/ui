# @zayne-labs/ui-react

## 0.9.10

### Patch Changes

- acbb091: feat(form, await): ✨ enhance form and await components

   - feat(form): Add form root context for global eye icon visibility
   - feat(form): Update FormInput to respect root context with local prop fallback
   - feat(form): Implement flexible eye icon configuration via boolean or custom render
   - feat(await): Refactor Await component with new slot-based API
   - feat(await): Add support for error boundaries and suspense fallbacks
   - feat(await): Improve type safety and component composition
   - chore: Update dependencies and lockfile

- fe14949: feat(ui-react/await): 🪝 export `AwaitContextProvider` & `useAwaitContext` hook from custom context
  fix(ui-react/await): 🐛 use `AwaitContextProvider` in `Await` component for correct rendering
  fix(ui-react/error-boundary): ⚙️ enhance `resetKeys` prop change detection logic
  refactor(ui-react/drop-zone): 🏷️ alias `DropZoneContext` as `Context` in part exports
  fix(ui-react/drop-zone): 🛡️ ensure `DropZoneProvider` consistently wraps children with context
  chore(deps): 📦 bump React to 19.1.0, update toolkit & other dependencies
  chore: 🔧 synchronize versions across package.json files & update pnpm-lock.yaml

## 0.9.8

### Patch Changes

- 6b470f4: refactor(utils/getSlotMap): improve slot children typing with Extract for ReactNode ♻️

   - refactor: use Extract<TSlotComponentProps["children"], React.ReactNode> to refine slot children type in GetSpecificSlotsType for better type safety 🧑‍💻

   refactor(drop-zone): simplify preview slot rendering logic ♻️

   - refactor: remove function check for slots.preview, now rendered directly (assumes preview is always a ReactNode) 🧹

## 0.9.4

### Patch Changes

- a68c115: 📝 docs(docs): Update main README and remove legacy component docs
  🗑️ rm(docs): Remove individual component documentation markdown files
  ✨ feat(components): Add new common documentation structure
  📦 chore(package): Update ui-react package dependencies

## 0.9.0

### Minor Changes

- 4e6363c: 📦 feat(form): ♻️ Add global eye icon control via form context

   ✨ feat(form): Add FormRoot context for global eye icon visibility control
   🔧 refactor(form): Update FormInput to respect context with local prop fallback
   📚 docs(form): Document new context system usage in form.md
   ⚡ perf(form): Memoize context value to prevent unnecessary re-renders
   🌱 chore(form): Maintain backward compatibility with lax context requirements"

## 0.8.19

### Patch Changes

- be58c73: add docs

## 0.8.12

### Patch Changes

- 424b27f: ✨ feat: add ui-react css style foundation
  📦 deps: bump @zayne-labs/toolkit-core to 0.9.29
  📦 deps: upgrade @types/node to 22.15.2
  📦 deps: update react-hook-form to 7.56.1
  🎨 ui: improve drag-scroll component behavior
  🎨 ui: enhance drop-zone file handling
  🎨 ui: optimize form validation logic

## 0.8.11

### Patch Changes

- 70dd791: feat: simplify await component

## 0.8.7

### Patch Changes

- 1805647: feat: introduce onRenderPropsChange callback to allow for sideeffects on props change when the hook is not used directly

## 0.8.5

### Patch Changes

- af29bcb: refactor(drop-zone): 🔄 optimize utils and update toolkit dependencies

## 0.8.0

### Minor Changes

- be704c7: feat(ui)!: 🔄 Restructure project architecture and update dependencies

   feat(drop-zone): ✨ Add new drop-zone component with utils and parts

   feat(ui): 🎨 Enhance carousel and form components

   refactor(focus-scope): 🗑️ Remove focus-scope component and related files

   chore(deps): ⬆️ Update package dependencies and lockfile

   style(css): 📦 Reorganize CSS structure with new tailwind configuration. No need for @source in the consuming file anymore

## 0.7.5

### Patch Changes

- edb150f: refactor(form): 🔄 Reorder props spread in FormTextArea and FormSelect components
  feat(form): ✨ Add composeEventHandlers and composeRefs from toolkit-type-helpers
  chore(deps): ⬆️ Update dependencies and upgrade @zayne-labs packages to v0.9.8

## 0.7.4

### Patch Changes

- faabcb6: fix(show): make work properly

## 0.7.0

### Minor Changes

- 50cac25: chore(deps): 📦 Update dependencies and package versions

   feat(ui-react): ✨ Add focus-scope component
   chore(deps): ⬆️ Upgrade @eslint-react/\* plugins to v1.43.0
   chore(deps): ⬆️ Bump @zayne-labs/toolkit packages to v0.9.3
   chore(deps): ⬆️ Update @types/react-dom to v19.1.2

## 0.6.3

### Patch Changes

- 50986f9: feat(await): add "use client" directive and enhance component with asChild prop

   - feat(await): add "use client" directive and enhance component with asChild prop
   - chore(deps): upgrade @zayne-labs/\* packages to v0.8.0
   - chore(deps): upgrade @eslint-react/eslint-plugin to v1.42.1
   - chore(deps): upgrade tailwind-merge to v3.2.0

## 0.6.2

### Patch Changes

- 494093d: feat(ui-react): ✨ Add FormTextArea and FormSelect components, and update FormInput

   This commit introduces the `FormTextArea` and `FormSelect` components, providing specialized form elements for text areas and select inputs. The `FormInput` component has also been updated to handle these new types using the `InputTypeMap`, improving code organization and maintainability.

## 0.6.1

### Patch Changes

- c9d0b63: feat(await): ✨ refactor Await component with new wrapper system
  refactor(await): ♻️ move SuspenseWithBoundary to common components
  chore(build): 🔧 update tsup config for new components

## 0.6.0

### Minor Changes

- 8f4fe41: feat(drop-zone): ✨ enhance useDropZone hook with better type safety and docs
  refactor(form): ♻️ rename FormFieldSubscribe/FormStateSubscribe to more descriptive names
  fix(form): 🐛 update form component imports to match new names

## 0.5.2

### Patch Changes

- 9ec5018: feat(deps): 🔧 upgrade @hookform/resolvers and other dependencies

   feat(form): ✨ enhance form component and context implementation

## 0.5.1

### Patch Changes

- d1c63f5: feat(deps): ⬆️ upgrade @zayne-labs/toolkit packages to v0.9.2
  refactor(components): ♻️ optimize Await and Show components
  chore(deps): 🔧 update vite to v6.2.4 and remove terser dependency

## 0.5.0

### Minor Changes

- b42320f: feat(components): ✨ Add Await and ErrorBoundary components

   feat(components): 🎨 Add Await component for handling async data rendering
   feat(components): 🛡️ Add ErrorBoundary component for graceful error handling
   feat(deps): ⬆️ Update dependencies and package versions
   chore(config): 🔧 Add turbo.json configuration

## 0.4.2

### Patch Changes

- d8c6dc8: ♻️ refactor(form): Simplify field state management and improve type safety

   🔥 refactor(form-context): Remove redundant useLaxGetFieldState hook
   🎨 refactor(form): Move field state handling to FormInput component
   ✨ feat(form): Add fieldState prop to form primitives for better control
   🏷️ feat(form): Improve TypeScript types for form state management

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
