---
"@zayne-labs/ui-react": patch
---

Changes:

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
