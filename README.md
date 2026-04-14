# iron-quizzer

A True/False quiz app built with [LWC OSS](https://lwc.dev/) (Lightning Web Components open source) for the Iron Coder challenge, by Adam and Lisa.

Questions are fetched live from the [Open Trivia Database](https://opentdb.com/) API. The UI follows Salesforce Lightning Design System (SLDS) conventions.

---

## Features

- 10 True/False questions per round, fetched from the OpenTDB API
- One question displayed at a time with fade-in / fade-out transitions
- Immediate correct/incorrect feedback after each answer
- Progress indicator ("Question X of 10")
- Score summary on completion ("You scored X / 10")
- Play Again reloads a fresh set of questions
- Error state with retry if the API call fails
- SLDS-inspired card, button, and typography styles
- Question card centered vertically and horizontally in the viewport

---

## Architecture

The app is composed of two LWC components:

### `quiz-main`

The top-level component. Owns all quiz state and orchestrates the flow.

- Fetches questions from OpenTDB on mount via `connectedCallback`
- Decodes HTML entities in question text (e.g. `&quot;` → `"`) using `DOMParser`
- Tracks `_currentIndex`, `_score`, `_loading`, `_error`, and `_exiting` as reactive state
- Renders one of four states: loading, error, question, or result
- Handles answer events from `quiz-item`: scores the answer, waits 1500 ms for the user to read feedback, then fades out (400 ms) before advancing to the next question
- `handlePlayAgain` re-runs the full fetch cycle

### `quiz-item`

A presentational component for a single question card.

- Receives a `question` object via `@api` with a getter/setter — the setter resets answered state whenever the question changes
- Renders question text, True/False buttons, and conditional feedback
- Disables both buttons after an answer is selected
- Dispatches an `answer` custom event with `{ detail: { correct: boolean } }`
- Applies BEM modifier classes (`question__feedback--correct` / `--incorrect`) for feedback styling

---

## Project Structure

```
src/
  index.html              # App shell — SLDS fonts, background, viewport centering
  index.js                # Registers quiz-main as a custom element
  modules/
    quiz/
      main/
        main.html         # Template: loading / error / question / result states
        main.js           # Quiz state machine, fetch, scoring, transitions
        main.css          # Layout, animations, progress text, brand buttons
      item/
        item.html         # Question card template
        item.js           # Answer handling, feedback state, answer event
        item.css          # SLDS card and neutral button styles
      __utam__/
        pageObjects/      # UTAM page objects for UI tests
tests/
  quiz.spec.js            # WebdriverIO end-to-end tests
```

---

## Development

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
```

### Build and serve

```bash
# One-time build + serve
node_modules/.bin/rollup -c
node_modules/.bin/wds --root-dir dist --no-open

# Or with auto-rebuild on file changes (two terminals)
node_modules/.bin/rollup -c --watch
node_modules/.bin/wds --root-dir dist --no-open
```

Open `http://localhost:8000/`.

### npm scripts

| Script                       | Description                                         |
| ---------------------------- | --------------------------------------------------- |
| `npm run build`              | Production build via rollup                         |
| `npm run build:development`  | Development build                                   |
| `npm run watch`              | Rollup in watch mode                                |
| `npm run serve`              | Serve `dist/` on port 8000                          |
| `npm run test:unit`          | Jest unit tests                                     |
| `npm run test:unit:coverage` | Jest with coverage report                           |
| `npm run test:unit:watch`    | Jest in watch mode                                  |
| `npm run test:ui`            | Build UTAM page objects + run WebdriverIO E2E tests |
| `npm run lint`               | ESLint                                              |
| `npm run prettier`           | Auto-format all source files                        |

---

## Testing

### Unit tests (Jest)

```bash
node_modules/.bin/jest
```

30 unit tests across `quiz/main` and `quiz/item` covering:

- Loading, error, and retry states
- HTML entity decoding in question text
- Progress text at each step
- Answer feedback (correct / incorrect text and CSS classes)
- Button disabled state after answering
- Question advancement and `@api` setter reset
- Fade-out CSS class applied during transition
- Score calculation and display after all 10 questions
- Play Again flow
- Edge case: empty API response does not show a score

Fake timers (`jest.useFakeTimers`) are used to control the 1500 ms + 400 ms transition timeouts synchronously in tests. `flushPromises` uses `await Promise.resolve()` rather than `process.nextTick` to avoid Jest's fake timer interference.

### End-to-end tests (WebdriverIO + UTAM)

```bash
npm run test:ui
```

Requires geckodriver. Tests cover page structure, feedback text, question progression, score format, and play-again behavior against the live running app.

---

## Updates — April 2026

The original project used `lwc-services` (a now-deprecated LWC scaffolding tool built on webpack) and had accumulated a backlog of Dependabot security alerts on its transitive dependencies. Rather than patch in place, the decision was made to modernize the entire stack and complete the originally-planned quiz features at the same time.

### Toolchain migration: lwc-services → rollup + @web/dev-server

Replaced the deprecated `lwc-services` / webpack build with a lean modern stack:

- **[`@lwc/rollup-plugin`](https://www.npmjs.com/package/@lwc/rollup-plugin)** + **rollup** for bundling
- **`@web/dev-server` (wds)** for local development serving
- **`@rollup/plugin-replace`** for `process.env.NODE_ENV` substitution
- **`rollup-plugin-copy`** to emit `index.html` and static resources to `dist/`

This eliminated the vulnerable dependency tree that `lwc-services` brought in and gave full control over the build pipeline.

### Vulnerability fixes

Four transitive dependency vulnerabilities were resolved via `overrides` in `package.json`, pinning patched versions:

| Package                | Reason                    |
| ---------------------- | ------------------------- |
| `jsondiffpatch`        | Prototype pollution       |
| `serialize-javascript` | Cross-site scripting      |
| `tar-fs`               | Path traversal            |
| `ws`                   | ReDoS / denial of service |

### Test suite (new)

The project had no tests. A full test suite was added:

- **Jest unit tests** (`src/modules/quiz/*/\_\_tests\_\_/`) — 30 tests covering all component behaviour (see [Testing](#testing) section for full details)
- **WebdriverIO E2E tests** (`tests/quiz.spec.js`) — browser-level tests using UTAM page objects, covering the full user journey
- **Coverage enforcement** — jest coverage thresholds ensure 100% coverage of application code
- **Husky + lint-staged** pre-commit hooks running Prettier and ESLint on staged files

### OpenTDB API integration

Replaced static/hardcoded questions with live fetch from `https://opentdb.com/api.php?amount=10&type=boolean`. Added `decodeHtml()` to handle HTML-encoded characters in question text. Added loading and error states with retry support.

### Single-question UX with transitions

Changed from rendering all questions simultaneously to displaying one at a time. After an answer is selected:

1. Feedback is shown for 1500 ms
2. The card fades out over 400 ms (`quiz__question-wrap--exiting` class)
3. The next question fades in

### Play Again

Added a Play Again button on the result screen that re-runs the full fetch cycle, resetting score and index.

### BEM class naming

Audited and standardised all CSS classes to follow Block-Element-Modifier naming (`quiz__progress`, `question__feedback--correct`, etc.) consistent with SLDS conventions.

### SLDS-inspired styling

- **Fonts:** `'Salesforce Sans', Arial, sans-serif` throughout; `#3e3e3c` body text
- **Background:** SLDS neutral gray `#f3f2f2`
- **Cards:** white background, `#dddbda` border, `0.25rem` border-radius, subtle box-shadow
- **Neutral buttons:** `#0070d2` text, white fill, hover/focus/disabled states
- **Brand buttons:** solid `#0070d2` fill with white text for Play Again and Retry
- **Feedback badges:** tinted green/red backgrounds with matching borders instead of plain colored text

### Viewport centering

The question card is centered both horizontally and vertically in the viewport using `display: flex; align-items: center; justify-content: center; min-height: 100vh` on the body.

### LWC custom element registration fix

Corrected `src/index.js` to only register the root component (`quiz-main`). Registering child components (`quiz-item`) separately caused a hard runtime crash: _"Unexpected tag name … is a registered custom element, preventing LWC to upgrade the element."_ Child components rendered through LWC templates must not be pre-registered. Used `Component.CustomElementConstructor` (replacing the deprecated `buildCustomElementConstructor`).

### Test suite hardening

- Replaced `flushPromises = () => new Promise(process.nextTick)` with multiple `await Promise.resolve()` calls to avoid breakage under `jest.useFakeTimers()` (which fakes `process.nextTick`)
- Added coverage exclusions for generated UTAM page objects
- Added edge-case test for empty API response ensuring no false score display
- Migrated to `lwc:elseif={currentQuestion}` (from `lwc:else`) to prevent null crash when API returns 0 results

---

## License

MIT
