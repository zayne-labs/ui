---
"@zayne-labs/ui-react": minor
---

feat: a lot of improvements made to the carousel and dropzone
refactor(drop-zone): ♻️ optimize drop-zone store and component structure

refactor(carousel): ♻️ replace getElementList with For component in carousel
refactor(drag-scroll): ♻️ optimize useDragScroll with useCallback and useMemo
refactor(slot): ♻️ update slot component implementation

chore: update dependencies and improve component structure

- Updated various dependencies in package.json and pnpm-lock.yaml for better compatibility and performance.
- Refactored components in the ui-react package, including Carousel and DropZone, to enhance functionality and maintainability.
- Adjusted props and types in Carousel and Form components for improved type safety and clarity.
- Cleaned up imports and optimized component rendering logic.

fix(form): update FieldValues type to accept any and ensure compatibility with arrays
