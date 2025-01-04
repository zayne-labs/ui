---
"@zayne-labs/ui-react": patch
---

feat(components): 🚀 Improve Show and Switch component exports and slot symbols

feat(show): 🔍 Update ShowFallback slot symbol for better clarity

- Change `Symbol.for("fallback")` to `Symbol.for("show-fallback")`
- Add direct `Show` export for easier component usage

feat(switch): 🔀 Enhance Switch component exports and default case handling

- Update default case slot symbol to `Symbol.for("switch-default")`
- Fix `getSlotElement` to use `SwitchDefault` instead of `Default`
- Add direct `Switch` export for more intuitive component usage
