# cobalt-input-element [![Deploy](https://github.com/manix84/cobalt-input-element/actions/workflows/pages.yml/badge.svg)](https://github.com/manix84/cobalt-input-element/actions/workflows/pages.yml)

This is a technical test, written in a little over 12 hours (broken up by housework), so some of it might be a little rushed compared to my normal work. If you've any questions, feel free to contact me.

## Basic Setup

- Clone repo: `git clone https://github.com/manix84/cobalt-input-element.git`
- Install dependencies: `npm i`

### Development

- Run `npm run dev`
- Open http://localhost:3000

### Production

- Run `npm run build`
- Run `npm run start`
- Open http://localhost:3000

## Testing

### Watch

- Run `jest --watch`

### Single Run

- Run `jest --ci`

## Design Considerations

### Important Points

- Cursor/Caret shown when the UI Input component is focussed.
- Ability to show/hide the characters.
  - For entering a password - where the hide replaces the chars with a '\*'.
  - The show/hide control is a separate component, whose value will be passed into the UI Input component to control.
- When 'hide' is enabled show the real character for a set period before changing to be a ‘_', the char to ‘hide’ the password characters can be hard coded to '_’.
- Make a suggestion on whether the cursor shall flash

### Q1. - Can you provide additional design considerations for the UI Input component based on the Login Page Design provided that are not mentioned/listed above?

First of all, decission needs to be made as to how close the component should come to looking and acting like a standard input element. In this case, I've elected to make the component look as close as reasonably possible to looking like a standard input container. Obviously, ClassName and Style have been exposed so that customisation is possible. When it comes to behaviour, the standard input element has too many intracacies (not to mention 30+ years of development), to replicate the whole component in short timespan. I've decided to add basic handling of cursor/caret control. The component is easily expandable to include new features, and can be quickly retrofitted TSX

### Q2. - Can you implement a React UI Input Component, written in Javascript, which covers the design considerations provided to you, plus the additional design considerations from Q1.

- https://github.com/manix84/cobalt-input-element/blob/main/components/Input.jsx
  - Tests: https://github.com/manix84/cobalt-input-element/blob/main/__tests__/components/Input.test.tsx
- https://github.com/manix84/cobalt-input-element/blob/main/components/HideCharsToggle.jsx
  - Tests: https://github.com/manix84/cobalt-input-element/blob/main/__tests__/components/HideCharsToggle.test.tsx
- https://github.com/manix84/cobalt-input-element/blob/main/components/Input.jsx
  - Tests: https://github.com/manix84/cobalt-input-element/blob/main/__tests__/pages/index.test.tsx

### Notes

- The Cursor/Caret has mutliple options, including "phase"/"smooth"/"blink"/"solid". These use a custom animation.
- The last Password Character delay is controlled by an input, with a default of 0ms. I'm using 1 second (1000ms), but it could be given a longer default, or hard coded if neccessary.
- I elected not to replicate the `defaultValue`/`value` technique used by modern form handlers, due to time constraints. Instead, using `value` as a combination value handler.
