---
"@zayne-labs/ui-react": patch
---

refactor(utils/getSlotMap): improve slot children typing with Extract for ReactNode ♻️

- refactor: use Extract<TSlotComponentProps["children"], React.ReactNode> to refine slot children type in GetSpecificSlotsType for better type safety 🧑‍💻

refactor(drop-zone): simplify preview slot rendering logic ♻️

- refactor: remove function check for slots.preview, now rendered directly (assumes preview is always a ReactNode) 🧹
