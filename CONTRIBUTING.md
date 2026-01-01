# Contributing Guidelines

Thank you for contributing to NeuroCare Nepal! Please follow these guidelines to maintain consistency across the project.

---

## Git Commit Message Rules

### Format

```
<type>(<scope>): <description>

[optional body]
```

### Examples

```
feat(auth): add biometric login support
```

```
chore(survey): update dialog styling and button text
- Apply theme-based styling to end day dialog
- Change button text from 'Continue' to 'Confirm'
- Add consistent color scheme for better UX
```

---

## Commit Types

| Type | Meaning |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance or dependency update |
| `refactor` | Code restructure (no behavior change) |
| `style` | Formatting only (no logic change) |
| `docs` | Documentation changes |
| `test` | Adding or updating tests |
| `perf` | Performance improvements |
| `ci` | CI/CD configuration or scripts |
| `revert` | Undo a previous commit |

---

## Scopes

Use a scope that describes the area of the codebase being modified:

```
auth, survey, dashboard, profile, api,
ui, navigation, storage, notification,
location, camera, forms, deps, config, security
```

---

## Description Rules

- ✅ Imperative mood → `add`, `fix`, `update`
- ✅ Lowercase start
- ✅ ≤ 50 characters
- ❌ No vague words: `update stuff`, `changes`

---

## Body (Optional)

- Explain what & why
- Use bullets for clarity
- Add breaking change note if needed
