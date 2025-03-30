# Gradient Stroke Text Component

A custom Gutenberg format type that applies gradient-colored outlines to text in the WordPress block editor.
## Features

-   **Gradient Stroke Picker**: Choose custom gradient colors for text outlines

-   **Stroke Width Control**: Adjust outline thickness (0.1px to 5px)

-   **One-Click Toggle**: Apply/remove with a single click (native behavior)

-   **Live Preview**: See changes instantly in the editor

-   **Translation Ready**: Full i18n support via  `@wordpress/i18n`

## Installation

1.  Add the  `gradient-stroke`  component to your project

2.  Import in your main JavaScript file:

    ``` import './gradient-stroke';```
    3.  Ensure translations are loaded via  `wp_set_script_translations()`
## Usage

1.  Highlight text in any rich text block

2.  Click the "Gradient Stroke" toolbar button

3.  Customize in the popover:

    -   Select gradient colors

    -   Adjust stroke width

4.  Re-click the button to remove

**HTML Output Example**:
``` <bdo class="magic-gradient-stroke"
     style="--gradient-stroke: linear-gradient(to right, #09f1b8, #fed90f); --stroke-width: 1.5px">
  Your Text
</bdo>
```
## Demo

[View Demo Video](https://www.awesomescreenshot.com/video/38191755?key=fbc0cdfce82132bd6dd6bd217c64df5b)
