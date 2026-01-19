# Mobile UI Refinement Guidelines for AutiSahara

## Target Audience
- **Rural Nepali parents** with potentially limited smartphone experience
- Parents who may be stressed/anxious about their child's condition
- Users who need clear, simple guidance at every step

---

## Core UI Principles

### 1. ONE THING AT A TIME
- Show only ONE primary action per screen
- Hide secondary options behind "More" or show them after primary action is complete
- Avoid showing multiple cards/options that compete for attention
- Use progressive disclosure - reveal complexity only when needed

### 2. LARGE TOUCH TARGETS
- Minimum button height: **56px** (preferably 64px)
- Minimum touch target: **48x48px** for any interactive element
- Add generous padding around buttons (16-20px)
- Increase spacing between interactive elements to prevent mis-taps

### 3. VISUAL HIERARCHY
- Use **size** to show importance (most important = biggest)
- Primary actions should be **full-width buttons** at the bottom of the screen
- Use bold, high-contrast colors for primary actions
- Secondary info should be visually muted (smaller, lighter color)

### 4. CLEAR VISUAL FEEDBACK
- Loading states with spinners AND text ("Loading...")
- Success states with checkmarks AND confirmation text
- Error states with clear icons AND simple explanation
- Button press states (scale down slightly, color change)

### 5. SIMPLE LANGUAGE (for any text)
- Use short sentences (max 10-12 words)
- Avoid technical terms
- Use action words: "Tap here", "Watch video", "Done"
- Add helpful icons next to text labels

---

## Component-Specific Guidelines

### Buttons
```
- Height: 56-64px minimum
- Full width for primary actions
- Rounded corners: 16-20px
- Font size: 16-18px, bold
- Include icon + text when possible
- Add shadow for depth/importance
```

### Cards
```
- One main message per card
- Large icon (32-48px) to identify card type
- Title: 18-20px, bold
- Subtitle: 14-16px, muted color
- Generous padding: 20-24px
- Clear visual boundary (border or shadow)
```

### Progress Indicators
```
- Use visual progress bars, not just numbers
- Show "Day 2 of 3" with filled/unfilled circles
- Use green for completed, orange for current, gray for upcoming
- Make progress bar thick (8-12px height)
```

### Lists/Tasks
```
- Large checkboxes (28-32px)
- Clear completed vs pending states
- One task visible at a time, or max 3
- "View all" button if more items exist
```

### Navigation
```
- Large back button (48x48px minimum)
- Clear page titles
- Avoid deep navigation (max 2-3 levels)
- Always show a way to go "Home"
```

---

## Color Usage

### Primary Actions
- Orange (#F97316) - Main brand, "Do this now"
- Use for primary buttons, important CTAs

### Status Colors
- Green (#10B981) - Success, completed, positive
- Yellow/Amber (#F59E0B) - Warning, in progress, attention
- Red (#EF4444) - Error, danger (use sparingly)
- Purple (#7C3AED) - Special, personalized content

### Backgrounds
- White (#FFFFFF) - Cards, primary content
- Light gray (#F9FAFB) - Page background
- Avoid dark backgrounds for main content

---

## Screen Layout Pattern

```
┌─────────────────────────────────────┐
│  ← Back          Page Title         │  <- Simple header
├─────────────────────────────────────┤
│                                     │
│     [Large Icon or Illustration]    │  <- Visual context
│                                     │
│         Main Message Here           │  <- One clear message
│         (short, simple text)        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │  <- Single content card
│  │   Card with ONE piece of    │   │     (if needed)
│  │   information               │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    PRIMARY ACTION BUTTON    │   │  <- Full width, bottom
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## Specific Refinements to Apply

### Home Screen
- Show ONLY the current state card (not multiple states)
- Make the main CTA button huge and obvious
- Remove or minimize the stats bar if not essential
- Show child's name prominently

### Task Screens
- One task per view with large "Complete" button
- Show video thumbnail large (not small)
- Clear status: "Not Done" vs "Done"
- Swipe or button to go to next task

### Assessment/M-CHAT
- One question per screen
- Large YES/NO buttons (not small radio buttons)
- Progress bar at top
- Clear "Next" button

### Video Upload
- Large camera/upload icon
- Simple instruction: "Record your child eating"
- Preview before confirming
- Clear upload progress

---

## Animation & Transitions

- Use subtle animations for feedback (button press, card appear)
- Avoid complex animations that slow down the experience
- Loading spinners should be visible and centered
- Success checkmarks should animate in

---

## Testing Checklist

Before finalizing any screen, verify:
- [ ] Can my grandparent use this without help?
- [ ] Is the primary action obvious within 2 seconds?
- [ ] Are touch targets at least 48x48px?
- [ ] Is text readable without zooming?
- [ ] Does it work on a small/old phone screen?
- [ ] Is there only ONE thing to focus on?

---

## Example Prompt for Refining a Component

When refining a specific component, use this prompt:

```
Refine this [COMPONENT NAME] for rural Nepali parents with limited smartphone experience.

Requirements:
1. Show only ONE primary action - what is the most important thing?
2. Increase all touch targets to minimum 56px height
3. Use large icons (32px+) with text labels
4. Simplify text to short, action-oriented phrases
5. Add clear visual feedback for all states
6. Use the color scheme: Orange for primary, Green for success, Gray for secondary
7. Ensure generous spacing (16-20px padding)
8. Make the primary CTA a full-width button at the bottom
9. Remove any non-essential information
10. Add helpful visual cues (icons, illustrations)

The user should understand what to do within 2 seconds of seeing the screen.
```

---

## Files to Refine (Priority Order)

1. `app/(tabs)/index.tsx` - Home screen (most important)
2. `app/therapy/today.tsx` - Daily tasks
3. `app/therapy/task-detail.tsx` - Individual task
4. `app/mchat/*.tsx` - Assessment flow
5. `app/videos/*.tsx` - Video upload flow
6. `app/profile/*.tsx` - Profile screens

---

Remember: **Simplicity is the ultimate sophistication.**
Every element on the screen should have a clear purpose. If it doesn't help the parent complete their task, remove it.
