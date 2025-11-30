# StampID Design System

> A Voice-First Stamp Collection App That Feels Like Opening a Vintage Treasure Chest

---

## Brand Philosophy

### The Core Insight

Stamps are **artifacts of human connection** - letters sent, stories told, history preserved. Our app should feel like:

> "Opening your grandfather's stamp album in a modern, magical way - where the stamps can tell you their own stories."

**NOT**: Cold, clinical AI tool
**YES**: Warm, inviting, knowledgeable companion

### Brand Personality

| Trait | Expression |
|-------|------------|
| **Knowledgeable** | Like a friendly antique dealer who knows every stamp's story |
| **Warm** | Inviting, not intimidating - even for beginners |
| **Premium** | Respects the craft of collecting, feels valuable |
| **Magical** | AI feels like wonder, not technology |
| **Timeless** | Vintage soul, modern execution |

---

## Color Palette

### Primary Philosophy: "Clean. Premium. Timeless."

A minimal, sophisticated palette inspired by:
- Vintage ink (deep forest green)
- Fine stationery (cream, off-white)
- Classic typography (near-black ink)
- Frosted glass (modern, elegant surfaces)

**The Rule:** Dark Green + Cream + Near-Black + Glass. Nothing else.

### The Palette

```
┌─────────────────────────────────────────────────────────────────┐
│                     STAMPID COLOR SYSTEM                        │
│                     "Less is More"                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRIMARY COLOR                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  FOREST GREEN (Primary Brand Color)                      │  │
│  │  #1B4332                                                 │  │
│  │                                                          │  │
│  │  Used for:                                               │  │
│  │  • Primary buttons                                       │  │
│  │  • Active states                                         │  │
│  │  • Voice recording indicator                             │  │
│  │  • Key UI accents                                        │  │
│  │  • Links and interactive elements                        │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  BACKGROUND COLORS                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  CREAM (Primary Background)     WHITE (Cards/Elevated)   │  │
│  │  #FAF9F6                        #FFFFFF                  │  │
│  │  Warm, easy on eyes             Clean, elevated surfaces │  │
│  │                                                          │  │
│  │  OFF-WHITE (Secondary BG)                                │  │
│  │  #F5F5F0                                                 │  │
│  │  Subtle depth, section dividers                         │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  TEXT COLORS                                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  NEAR-BLACK (Primary Text)      GRAY (Secondary Text)    │  │
│  │  #1A1A1A                        #6B6B6B                  │  │
│  │  Headlines, body text           Captions, timestamps     │  │
│  │                                                          │  │
│  │  MUTED (Placeholder/Disabled)                           │  │
│  │  #9CA3AF                                                 │  │
│  │  Input placeholders, disabled states                    │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  SEMANTIC COLORS (Used Sparingly)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  SUCCESS: #22C55E (Green - same family as primary)      │  │
│  │  WARNING: #F59E0B (Amber - warm, visible)               │  │
│  │  ERROR:   #EF4444 (Red - clear danger signal)           │  │
│  │  INFO:    #1B4332 (Use primary green for info)          │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  GLASS EFFECT (Frosted Glass for Cards, Buttons, Modals)       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Background: rgba(255, 255, 255, 0.7)                   │  │
│  │  Backdrop blur: 20px                                     │  │
│  │  Border: 1px solid rgba(255, 255, 255, 0.3)             │  │
│  │  Shadow: 0 8px 32px rgba(0, 0, 0, 0.08)                 │  │
│  │                                                          │  │
│  │  Creates elegant, floating surfaces                      │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Reference

```
LIGHT MODE:

┌──────────────────────────────────────────────────────────────┐
│  ████████████████████████████████████████  #FAF9F6  Cream BG │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  #FFFFFF  Glass    │
│  ████                                      #1B4332  Green    │
│  ████████████████████████████████████████  #1A1A1A  Text     │
│  ████████████████████                      #6B6B6B  Gray     │
└──────────────────────────────────────────────────────────────┘
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary Brand Color
        forest: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#1B4332', // PRIMARY - Deep Forest
          950: '#0F2419',
        },

        // Background Colors
        cream: {
          DEFAULT: '#FAF9F6',
          50:  '#FFFFFF',
          100: '#FAF9F6', // Primary BG
          200: '#F5F5F0', // Secondary BG
          300: '#EBEBEB',
        },

        // Text Colors
        ink: {
          DEFAULT: '#1A1A1A', // Primary text
          light: '#6B6B6B',   // Secondary text
          muted: '#9CA3AF',   // Placeholder/disabled
        },

        // Semantic (used sparingly)
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },

      // Glass effect utilities
      backdropBlur: {
        glass: '20px',
      },

      // Glass shadows
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.12)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.06)',
      },
    },
  },
};
```

### Glass Component Styles

```typescript
// Frosted Glass Card
const glassCard = `
  bg-white/70
  backdrop-blur-glass
  border border-white/30
  shadow-glass
  rounded-2xl
`;

// Frosted Glass Button
const glassButton = `
  bg-white/80
  backdrop-blur-glass
  border border-white/40
  shadow-glass-sm
  rounded-xl
  active:bg-white/90
  active:scale-[0.98]
`;

// Primary Button (Solid Green)
const primaryButton = `
  bg-forest-900
  text-white
  rounded-xl
  shadow-glass-sm
  active:bg-forest-800
  active:scale-[0.98]
`;

// Glass Input
const glassInput = `
  bg-white/60
  backdrop-blur-glass
  border border-white/40
  rounded-xl
  text-ink
  placeholder:text-ink-muted
  focus:border-forest-900/30
  focus:ring-2
  focus:ring-forest-900/10
`;

// Glass Modal/Sheet
const glassModal = `
  bg-white/80
  backdrop-blur-glass
  border border-white/30
  shadow-glass-lg
  rounded-3xl
`;
```

### Dark Mode Palette

Dark mode inverts to forest green as the canvas:

```
DARK MODE

┌──────────────────────────────────────────────────────────────┐
│  ████████████████████████████████████████  #0F1A14  Dark BG  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Glass (white/10%) │
│  ████                                      #4ADE80  Light Grn│
│  ████████████████████████████████████████  #F5F5F0  Text     │
│  ████████████████████                      #9CA3AF  Gray     │
└──────────────────────────────────────────────────────────────┘

Background:     #0F1A14 (Deep forest black)
Surface:        rgba(255, 255, 255, 0.05) (Subtle glass)
Surface High:   rgba(255, 255, 255, 0.10) (Cards, modals)

Text Primary:   #F5F5F0 (Cream/off-white)
Text Secondary: #9CA3AF (Muted gray)

Accent:         #4ADE80 (Lighter green for contrast)
Primary Action: #22C55E (Success green, vibrant on dark)
```

### Usage Guidelines

```
DO:
✓ Use forest-900 for primary actions
✓ Use cream-100 as main background
✓ Use glass effects for cards, buttons, modals
✓ Keep text in ink/ink-light hierarchy
✓ Use semantic colors only for status

DON'T:
✗ Add additional accent colors
✗ Use gradients (keep it flat)
✗ Mix different glass opacities randomly
✗ Use pure black (#000000) for text
✗ Use forest green for large background areas
```

---

## Typography

### Font Selection Philosophy

**Headlines**: Elegant, timeless - like engravings on old stamps
**Body**: Clean, readable - modern without being cold
**Numbers**: Distinctive - for values, years, catalog numbers

### Recommended Font Stack

```
PRIMARY (Headlines & Display):
┌─────────────────────────────────────────────────────────┐
│  OPTION A: Playfair Display                             │
│  - Free on Google Fonts                                 │
│  - High contrast, elegant serifs                        │
│  - Feels like vintage typography                        │
│                                                         │
│  OPTION B: Libre Baskerville                            │
│  - More traditional, highly readable                    │
│  - Classic book typography                              │
│                                                         │
│  OPTION C: Cormorant Garamond                          │
│  - Lighter, more refined                                │
│  - Excellent for luxury feel                            │
└─────────────────────────────────────────────────────────┘

SECONDARY (Body & UI):
┌─────────────────────────────────────────────────────────┐
│  OPTION A: Inter                                        │
│  - Clean, modern, highly legible                        │
│  - Great for UI elements                                │
│                                                         │
│  OPTION B: Source Sans Pro                              │
│  - Slightly warmer than Inter                           │
│  - Adobe open source                                    │
│                                                         │
│  OPTION C: DM Sans                                      │
│  - Geometric but friendly                               │
│  - Modern but not cold                                  │
└─────────────────────────────────────────────────────────┘

MONOSPACE (Catalog Numbers, Values):
┌─────────────────────────────────────────────────────────┐
│  JetBrains Mono or IBM Plex Mono                       │
│  - For Scott #, prices, technical data                 │
│  - Distinguished from body text                        │
└─────────────────────────────────────────────────────────┘
```

### Typography Scale

```
DISPLAY (App name, hero text):     32-40px / Playfair Display Bold
HEADLINE 1 (Screen titles):        28px / Playfair Display SemiBold
HEADLINE 2 (Section headers):      22px / Playfair Display Medium
HEADLINE 3 (Card titles):          18px / Playfair Display Medium

BODY LARGE (Featured content):     18px / Inter Regular
BODY (Standard text):              16px / Inter Regular
BODY SMALL (Secondary info):       14px / Inter Regular
CAPTION (Timestamps, hints):       12px / Inter Regular

LABEL (Buttons, badges):           14px / Inter SemiBold
OVERLINE (Categories):             12px / Inter SemiBold, uppercase, tracking wide

VALUE (Prices, catalog #):         16-20px / JetBrains Mono Medium
```

### Implementation

```typescript
// lib/fonts.ts
import {
  Playfair_Display,
  Inter,
  JetBrains_Mono
} from 'expo-google-fonts';

export const fonts = {
  // Headlines
  displayBold: 'PlayfairDisplay_700Bold',
  displaySemiBold: 'PlayfairDisplay_600SemiBold',
  displayMedium: 'PlayfairDisplay_500Medium',

  // Body
  bodyRegular: 'Inter_400Regular',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',

  // Mono
  mono: 'JetBrainsMono_500Medium',
};
```

---

## Voice-First / Chat-First Experience

### The Core Concept

StampID is **conversation-first**. The AI agent ("Stamp Expert") is always accessible:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  "Hey StampID, find me stamps from                             │
│   Germany in the 1930s worth over $50"                         │
│                                                                 │
│              ↓                                                  │
│                                                                 │
│  [AI searches entire user database]                            │
│  [Returns visual grid of matching stamps]                      │
│  [Can refine with follow-up questions]                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Voice Interface Design

#### The Voice Button

```
IDLE STATE:
┌─────────────────────────────────┐
│                                 │
│           ┌───────┐            │
│           │  🎙️   │            │  Forest green circle (#1B4332)
│           │       │            │  White microphone icon
│           └───────┘            │  Subtle pulse animation
│                                 │
│    "Tap to talk to StampID"    │  Frosted glass background
│                                 │
└─────────────────────────────────┘

LISTENING STATE:
┌─────────────────────────────────┐
│                                 │
│     ╭─────────────────────╮    │
│     │ ≋≋≋ ▌▌▌ ≋≋≋ ▌▌▌ ≋≋≋ │    │  Waveform animation
│     │     Listening...     │    │  Forest green bars
│     ╰─────────────────────╯    │  Responds to voice amplitude
│                                 │  Glass container
└─────────────────────────────────┘

PROCESSING STATE:
┌─────────────────────────────────┐
│                                 │
│           ╭───────╮            │
│           │ ◠ ◠ ◠ │            │  Thinking dots
│           │  ...  │            │  Green shimmer effect
│           ╰───────╯            │
│                                 │
│    "Searching 50,000 stamps"   │  Muted text (#6B6B6B)
│                                 │
└─────────────────────────────────┘

RESPONDING STATE:
┌─────────────────────────────────┐
│                                 │
│     ╭─────────────────────╮    │
│     │ ))) ◉ (((           │    │  Speaker animation
│     │  Speaking...        │    │  Soft green glow
│     ╰─────────────────────╯    │
│                                 │
└─────────────────────────────────┘
```

#### Waveform Animation Specs

```typescript
// Voice waveform configuration
const voiceWaveConfig = {
  // Colors (single color system - clean)
  colors: {
    primary: '#1B4332',   // Forest green
    active: '#22C55E',    // Brighter green when speaking
    glow: 'rgba(27, 67, 50, 0.2)', // Subtle green glow
    background: 'rgba(255, 255, 255, 0.7)', // Glass background
  },

  // Animation
  barCount: 40,
  minHeight: 4,
  maxHeight: 40,
  animationDuration: 100, // ms per update

  // Style
  barWidth: 3,
  barGap: 2,
  borderRadius: 2,

  // Behavior
  smoothing: 0.8, // Audio smoothing factor
  sensitivity: 1.5, // Response to volume
};
```

### Chat Interface Design

#### The Persistent Chat Bar

Always visible at bottom of screen (except camera):

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ╭─────────────────────────────────────────────────────────╮   │
│  │  🔍  Ask about any stamp...                    🎙️  📷   │   │
│  ╰─────────────────────────────────────────────────────────╯   │
│                                                                 │
│       Text input      │     Voice    │   Camera scan           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Chat Conversation View

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back                                        StampID Expert   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                        TODAY                                    │
│                                                                 │
│  ╭─────────────────────────────────────────────────────╮       │
│  │ Find me rare US stamps from the 1920s              │  YOU  │
│  ╰─────────────────────────────────────────────────────╯       │
│                                                                 │
│       ╭───────────────────────────────────────────────────╮    │
│  AI   │ I found 23 stamps from US collectors in the       │    │
│       │ 1920s. Here are the most valuable:                │    │
│       │                                                   │    │
│       │ ┌────────┐ ┌────────┐ ┌────────┐                 │    │
│       │ │ 🖼️     │ │ 🖼️     │ │ 🖼️     │                 │    │
│       │ │ $450   │ │ $320   │ │ $280   │                 │    │
│       │ └────────┘ └────────┘ └────────┘                 │    │
│       │                                                   │    │
│       │ Would you like to filter by condition or         │    │
│       │ see more details on any of these?                │    │
│       ╰───────────────────────────────────────────────────╯    │
│                                                                 │
│  ╭─────────────────────────────────────────────────────╮       │
│  │ Show me only mint condition                        │  YOU  │
│  ╰─────────────────────────────────────────────────────╯       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ╭─────────────────────────────────────────────────────────╮   │
│  │  Type a message...                            🎙️  📷   │   │
│  ╰─────────────────────────────────────────────────────────╯   │
└─────────────────────────────────────────────────────────────────┘
```

#### AI Agent Personality

```
NAME: "The Stamp Expert" (or just "Expert")

PERSONALITY:
- Knowledgeable but not condescending
- Enthusiastic about stamps (shares interesting facts)
- Helpful in guiding collectors to discover
- Occasionally shares historical context unprompted

VOICE CHARACTERISTICS:
- Warm, measured pace
- Scholarly but approachable
- Gender-neutral option available
- Multiple voice options (Classic Expert, Modern Guide, etc.)

EXAMPLE RESPONSES:

User: "What's this stamp worth?"
Expert: "This is a beautiful 1954 Liberty Series 3-cent stamp
        featuring the Statue of Liberty. In your stamp's
        condition, it's worth approximately $2-5. Fun fact:
        this was one of the most printed stamps in US history!"

User: "Find expensive British stamps"
Expert: "I found 47 British stamps valued over $100 in our
        collection. The Penny Black from @collector_jane
        is particularly stunning - would you like to see it first?"
```

### Voice Commands

```
DISCOVERY:
"Find stamps from [country]"
"Show me stamps worth more than [$amount]"
"What stamps from the [decade] do we have?"
"Find [theme] stamps" (birds, flowers, trains, etc.)

IDENTIFICATION:
"What is this stamp?"
"How much is this worth?"
"Tell me about this stamp"

COLLECTION:
"Add this to my [collection name]"
"How many stamps do I have?"
"What's my most valuable stamp?"
"Show me my recent additions"

MARKETPLACE (Future):
"Are any of my stamps for sale?"
"Who's selling [specific stamp]?"
"Set an alert for [stamp type]"
```

---

## Animation System

### Philosophy

> "Every animation should feel like discovering something precious"

- **Purposeful**: Animations guide, they don't distract
- **Organic**: Movements feel natural, not mechanical
- **Delightful**: Small moments of magic throughout
- **Performant**: 60fps on all devices

### Signature Animations

#### 1. Stamp Reveal (Identification Result)

```
┌─────────────────────────────────────────────────────────────────┐
│                     STAMP REVEAL SEQUENCE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STAGE 1: Envelope Unfold (0-400ms)                            │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                     │
│  │ ▼▼▼▼▼▼▼ │ → │  ╲   ╱  │ → │         │                     │
│  │ ███████ │    │   ╲╱   │    │  🖼️     │                     │
│  │ ███████ │    │  stamp │    │  stamp  │                     │
│  └─────────┘    └─────────┘    └─────────┘                     │
│   Envelope      Flap opens     Stamp revealed                  │
│                                                                 │
│  STAGE 2: Details Cascade (400-800ms)                          │
│  - Country fades in from left                                   │
│  - Year fades in from right                                     │
│  - Value scales up from center with green shimmer              │
│  - Catalog # types in like old typewriter                      │
│                                                                 │
│  STAGE 3: Confidence Ring (800-1000ms)                         │
│  - Circular progress fills around stamp                        │
│  - Color indicates confidence (green = high, gray = medium)    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 2. Glass Button Press

```
┌─────────────────────────────────────────────────────────────────┐
│                      GLASS BUTTON INTERACTION                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  IDLE:           PRESSED:          RELEASED:                   │
│                                                                 │
│    ╭───╮          ╭───╮             ╭───╮                      │
│   ╱ ♔ ╲        ╱ ♔ ╲ ↓          ╱ ♔ ╲  ✓                   │
│  │     │      │     │           │     │                        │
│   ╲   ╱        ╲   ╱             ╲   ╱                        │
│    ╰───╯          ╰───╯             ╰───╯                      │
│                                                                 │
│  - Scale to 0.95                                               │
│  - Subtle "press into wax" shadow                              │
│  - Green ripple on release                                      │
│  - Haptic feedback                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 3. Collection Grid Entrance

```
┌─────────────────────────────────────────────────────────────────┐
│                    STAMP GRID ENTRANCE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Stamps enter like being laid on a table:                      │
│                                                                 │
│  T+0ms    T+50ms   T+100ms  T+150ms  T+200ms                   │
│  ┌──┐                                                          │
│  │1 │     ┌──┐                                                 │
│  └──┘     │2 │     ┌──┐                                        │
│           └──┘     │3 │     ┌──┐                               │
│                    └──┘     │4 │     ┌──┐                      │
│                             └──┘     │5 │                      │
│                                      └──┘                      │
│                                                                 │
│  - Staggered entrance (50ms between items)                     │
│  - Slight rotation on entry (-2° to +2°)                       │
│  - Subtle shadow grows as stamp "lands"                        │
│  - Scale from 0.8 → 1.0                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 4. Value Change Animation

```
┌─────────────────────────────────────────────────────────────────┐
│                    VALUE DISPLAY ANIMATION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  When showing estimated value:                                  │
│                                                                 │
│  ┌─────────────────────────────────────┐                       │
│  │                                     │                       │
│  │    $▓▓▓ → $1▓▓ → $12▓ → $125       │                       │
│  │                                     │                       │
│  │    Numbers "roll" like slot machine │                       │
│  │    Green shimmer on final reveal    │                       │
│  │                                     │                       │
│  └─────────────────────────────────────┘                       │
│                                                                 │
│  Duration: 800ms                                                │
│  Easing: easeOutExpo                                           │
│  Haptic: Light impact on completion                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 5. Pull-to-Refresh: Magnifying Glass

```
┌─────────────────────────────────────────────────────────────────┐
│                    PULL TO REFRESH                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Instead of generic spinner:                                    │
│                                                                 │
│  PULLING:          THRESHOLD:        REFRESHING:               │
│                                                                 │
│      ○              ⌕                 🔍                       │
│      │              │              ╭──────╮                    │
│    ──┴──          ──┴──           │ 🖼️🖼️🖼️ │                   │
│                                    ╰──────╯                    │
│                                                                 │
│  Empty lens      Lens fills       Magnifying glass             │
│  grows           with color       "scans" stamps               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Micro-Interactions

```typescript
// Animation timing constants
export const timing = {
  instant: 100,      // Immediate feedback
  fast: 200,         // Button presses, toggles
  normal: 300,       // Standard transitions
  slow: 500,         // Complex animations
  dramatic: 800,     // Reveal moments
};

// Easing curves
export const easing = {
  // Standard interactions
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),

  // Enter screen
  decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),

  // Exit screen
  accelerate: Easing.bezier(0.4, 0.0, 1, 1),

  // Bouncy (for stamps landing)
  bounce: Easing.bezier(0.34, 1.56, 0.64, 1),

  // Dramatic reveals
  dramatic: Easing.bezier(0.19, 1, 0.22, 1),
};

// Haptic patterns
export const haptics = {
  buttonPress: 'impactLight',
  success: 'notificationSuccess',
  error: 'notificationError',
  stampLand: 'impactMedium',
  valueReveal: 'impactHeavy',
  voiceStart: 'impactLight',
  voiceEnd: 'impactMedium',
};
```

---

## Screen Layouts

### Home Screen (Chat-First)

```
┌─────────────────────────────────────────────────────────────────┐
│ ≡                     StampID                            ●  ●  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ╭─────────────────────────────────────────────────────────╮   │
│  │                                                         │   │
│  │                    ╭───────────╮                        │   │
│  │                    │    🎙️    │                        │   │
│  │                    │           │                        │   │
│  │                    ╰───────────╯                        │   │
│  │                                                         │   │
│  │              "Tap to talk to StampID"                  │   │
│  │                                                         │   │
│  │         or type your question below                    │   │
│  │                                                         │   │
│  ╰─────────────────────────────────────────────────────────╯   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  RECENT DISCOVERIES                                    See All │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  🖼️     │ │  🖼️     │ │  🖼️     │ │  🖼️     │              │
│  │ $12.50  │ │ $3.00   │ │ $45.00  │ │ $8.00   │              │
│  │ US 1954 │ │ UK 1967 │ │ FR 1923 │ │ JP 2001 │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  COLLECTION STATS                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  127 stamps  •  $1,234 value  •  12 countries          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ╭─────────────────────────────────────────────────────────╮   │
│  │  🔍  Ask about any stamp...                    🎙️  📷   │   │
│  ╰─────────────────────────────────────────────────────────╯   │
├─────────────────────────────────────────────────────────────────┤
│   🏠          📮           🔍          👤                      │
│  Home       My Stamps    Explore     Profile                   │
└─────────────────────────────────────────────────────────────────┘
```

### Identification Result Screen

```
┌─────────────────────────────────────────────────────────────────┐
│  ←                  Stamp Identified!                     ✕    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│         ╭─────────────────────────────────────╮                │
│         │                                     │                │
│         │                                     │                │
│         │           🖼️ STAMP IMAGE            │                │
│         │              (zoomable)             │                │
│         │                                     │                │
│         │                                     │                │
│         ╰─────────────────────────────────────╯                │
│                        ◉◉◉◉◉◉◉○○○                              │
│                      92% Confident                             │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                 │
│  🇺🇸  United States                              Scott #1035   │
│                                                                 │
│  Liberty Series - Statue of Liberty                            │
│  3 CENT • 1954                                                 │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                 │
│  ESTIMATED VALUE                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │           $2.00  ━━━━━●━━━━━  $5.00                    │   │
│  │                    ~$3.50                              │   │
│  │                                                         │   │
│  │  Condition: Used • Good                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                 │
│  📖 HISTORY                                                    │
│  This was one of the most widely printed stamps in US          │
│  history, part of the Liberty Series issued 1954-1968...       │
│                                                           MORE │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ╭──────────────────────╮  ╭──────────────────────╮           │
│  │   Save to Collection │  │     Scan Another     │           │
│  │         📁          │  │          📷          │           │
│  ╰──────────────────────╯  ╰──────────────────────╯           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Voice Search Active State

```
┌─────────────────────────────────────────────────────────────────┐
│                                                          ✕     │
│                                                                 │
│                                                                 │
│                                                                 │
│                                                                 │
│                    ╭─────────────────────╮                     │
│                    │                     │                     │
│                    │  ≋≋≋ ▌▌▌ ≋≋≋ ▌▌▌ ≋≋≋  │                     │
│                    │                     │                     │
│                    ╰─────────────────────╯                     │
│                                                                 │
│                        Listening...                            │
│                                                                 │
│                                                                 │
│       "Find me stamps from Germany worth over fifty..."        │
│                                                                 │
│                       (live transcription)                     │
│                                                                 │
│                                                                 │
│                                                                 │
│                                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                 │
│  TRY SAYING:                                                   │
│  • "What stamps do I have from Japan?"                         │
│  • "Show me my most valuable stamps"                           │
│  • "Find bird stamps under $20"                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### GlassStampCard

```typescript
interface StampCardProps {
  stamp: Stamp;
  variant: 'grid' | 'list' | 'featured';
  onPress: () => void;
  showValue?: boolean;
  showCondition?: boolean;
}

// Grid variant: 2-column layout
// List variant: horizontal with details
// Featured variant: large with full info
```

### VoiceButton

```typescript
interface VoiceButtonProps {
  state: 'idle' | 'listening' | 'processing' | 'speaking';
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  // Audio levels for waveform (0-1)
  audioLevels?: number[];
}
```

### ChatMessage

```typescript
interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    stamps?: Stamp[]; // If message includes stamp results
    timestamp: Date;
  };
  isLatest: boolean;
}
```

### ValueDisplay

```typescript
interface ValueDisplayProps {
  low: number;
  high: number;
  currency: string;
  animate?: boolean; // Slot machine animation
  size?: 'small' | 'medium' | 'large';
}
```

---

## Iconography

### Icon Style

- **Line weight**: 1.5-2px
- **Style**: Rounded corners, friendly
- **Library**: Lucide Icons (open source, consistent)

### Custom Icons Needed

```
STAMP-SPECIFIC:
📮 stamp-outline
📮 stamp-filled
🔍 magnifying-stamp (magnifying glass with perforations)
📦 album
🏷️ catalog-tag
💰 value-tag
⭐ condition-star

VOICE/CHAT:
🎙️ microphone
🔊 speaker-wave
💬 chat-bubble
🤖 expert-avatar

ACTIONS:
📷 camera-scan
➕ add-to-collection
🔄 scan-again
📤 share-stamp
```

---

## Accessibility

### Voice-First Benefits

- Full app usable without looking at screen
- Screen reader optimized
- Voice commands for all major actions

### Visual Accessibility

```
CONTRAST RATIOS (WCAG AA):
- Body text (#1A1A1A) on cream: 14.5:1 ✓
- Secondary text (#6B6B6B) on cream: 5.2:1 ✓
- Green (#1B4332) on white: 10.8:1 ✓
- White text on green buttons: 10.8:1 ✓

TOUCH TARGETS:
- Minimum: 44x44px
- Recommended: 48x48px
- Voice button: 64x64px (prominent)

MOTION:
- Respect reduced motion preferences
- Provide static alternatives
- No auto-playing animations
```

---

## Implementation Priority

### Phase 1: Foundation
1. Set up color tokens in Tailwind
2. Configure fonts (Playfair Display + Inter)
3. Create base animation utilities
4. Build VoiceButton component

### Phase 2: Core Components
1. GlassStampCard variants
2. ChatMessage component
3. ValueDisplay with animation
4. Waveform visualizer

### Phase 3: Screens
1. Home with voice-first UI
2. Camera/Scan flow
3. Identification results
4. Collection management

### Phase 4: Polish
1. All micro-interactions
2. Haptic feedback
3. Sound design (subtle)
4. Performance optimization

---

## Inspiration & References

### Design Inspiration
- [Rabbit R1](https://www.rabbit.tech/rabbit-r1) - Voice-first, warm orange, retro-future
- [ChatGPT Voice Mode](https://openai.com/index/chatgpt-can-now-see-hear-and-speak/) - Fluid waveform animation
- [Cleo App](https://www.meetcleo.com/) - Friendly AI personality in finance
- [Teenage Engineering](https://teenage.engineering/) - Premium minimalism

### Color Inspiration
- Fine cream stationery
- Old leather stamp albums
- Aged parchment paper
- Frosted glass surfaces
- Museum display cases

### Animation Inspiration
- [Awwwards UI Animation Collection](https://www.awwwards.com/awwwards/collections/animation/)
- Envelope opening sequences
- Vintage printing press movements
- Magnifying glass interactions

---

## Summary

**StampID** is not just another AI app. It's:

| Traditional AI App | StampID |
|-------------------|---------|
| Cold blue/purple | **Forest green + cream** |
| Tap-first | Voice-first |
| Clinical | Personal & knowledgeable |
| Feature grid | Conversation flow |
| Generic tech feel | Vintage treasure feel |

> "Every interaction should feel like discovering a rare stamp in your grandfather's collection."

---

*Document Version: 1.0*
*Last Updated: November 25, 2025*
