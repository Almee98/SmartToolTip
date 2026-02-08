# Responsitip

Responsive tooltip wrapper for React that switches hover/click behavior by breakpoint.

## Install

```
npm install responsitip
```

## Peer dependencies

- react
- react-dom
- react-bootstrap
- prop-types

## Usage

```jsx
import Responsitip from 'responsitip';

<Responsitip title="Hello" triggerType="both" placement="top">
  <span>Hover or tap me</span>
</Responsitip>
```

## Props

- title (node, required)
- triggerType: "hover" | "click" | "both" (default: "hover")
- placement: string (default: "top")
- tooltipId: string
- fillContainer: boolean (default: false)
- children (node, required)

## Development

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Visual Testing (Demo)

```bash
# Start the demo app
npm run dev
```

This will start a development server with an interactive demo page where you can:
- Test all trigger types (hover, click, both)
- See behavior change at the 900px breakpoint
- Test different placements
- Test multiple tooltips and their interactions

Resize your browser window to see how the tooltip behavior changes between desktop (≥900px) and mobile (<900px) modes.

### Building

```bash
# Build the library
npm run build
```
