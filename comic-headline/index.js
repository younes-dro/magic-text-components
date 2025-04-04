import "./style.scss";
import { __ } from "@wordpress/i18n";
import { brush } from "@wordpress/icons";
import { useState, useCallback, useEffect } from "@wordpress/element";
import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import {
  Popover,
  Button,
  FontSizePicker,
  RadioControl,
} from "@wordpress/components";
import { FontOptions, FontSizes, FallbackFontSize } from "./FontOptions";

// console.debug(FontOptions);

const textDomain = "magic-text";

const LABEL_POPOVER_TITLE =
  __("Customize the Comic Headline", textDomain) ||
  "Customize the Comic Headline";

const LABEL_TOOLBAR_TITLE =
  __("Comic Headline", textDomain) || "Comic Headline";

const LABEL_BUTTON_APPLY = __("Apply", textDomain) || "Apply";

const ComicHeadlineUI = ({
  onClose,
  onChange,
  popoverAnchor,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  setFontName,
}) => {
  const fontRadioOptions = FontOptions.map((font) => ({
    label: font.name,
    value: font.fontFamily,
  }));
  // console.log(fontRadioOptions);
  return (
    <Popover anchor={popoverAnchor} className="magic-text-bg-popover">
      <div style={{ minWidth: "320px", padding: "16px" }}>
        <h4 style={{ marginBottom: "12px" }}>{LABEL_POPOVER_TITLE}</h4>

        <RadioControl
          label={__("Font Family", textDomain) || "Font Family"}
          help={
            __("Select a font family", textDomain) || "Select a font family"
          }
          selected={fontFamily}
          options={fontRadioOptions}
          onChange={(newFontFamily) => {
            setFontFamily(newFontFamily);
            const newFontName = fontRadioOptions.find(
              (font) => font.value === newFontFamily
            )?.label;
            setFontName(newFontName);
          }}
        />
        <FontSizePicker
          __next40pxDefaultSize
          fallbackFontSize={FallbackFontSize}
          fontSizes={FontSizes}
          value={fontSize}
          onChange={(newFontSize) => setFontSize(newFontSize)}
        />

        <Button
          variant="primary"
          onClick={() => {
            onChange();
            onClose();
          }}
        >
          {LABEL_BUTTON_APPLY}
        </Button>
      </div>
    </Popover>
  );
};

const ComicHeadline = ({ value, onChange, isActive }) => {
  const [isAddComicHeadline, SetIsAddComicHeadline] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState();
  const [fontFamily, setFontFamily] = useState("Comic Sans MS");
  const [fontName, setFontName] = useState("Comic Sans MS");
  const [fontSize, setFontSize] = useState("20");

  const applyComicHeadline = useCallback(() => {
    // console.log("toggleFormat font :" + fontFamily);
    onChange(
      toggleFormat(value, {
        type: "magic-text/comic-headline",
        attributes: {
          style: `--font-family: ${fontFamily}; --font-size: ${fontSize}`,
        },
      })
    );
  }, [onChange, value, fontFamily, fontSize]);

  const handleToolbarClick = useCallback(() => {
    if (isActive) {
      onChange(toggleFormat(value, { type: "magic-text/comic-headline" }));
    } else {
      SetIsAddComicHeadline(true);
    }
  }, [isActive, onChange, value]);

  useEffect(() => {
    console.log("Create link :" + fontFamily);
    console.log("fontName :" + fontName);

    if (!fontName) {
      return;
    }
		const integrity = FontOptions.find((font) => font.name === fontName)
			?.integrity;
			console.log("integrity :" + integrity);
    // Remove any existing font link
    const existingLink = document.querySelector(
      `link[href*="${fontName.replace(/\s+/g, "+")}"]`
    );
    if (existingLink) {
      document.head.removeChild(existingLink);
    }

    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      /\s+/g,
      "+"
    )}&display=swap`;
    console.log("font URL: " + fontUrl);
    const link = document.createElement("link");
    link.href = fontUrl;
    link.rel = "stylesheet";
    link.integrity = integrity;
    link.crossOrigin = "anonymous";
    // link.onload = () => {}
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [fontName]);

  return (
    <>
      <div ref={setPopoverAnchor}>
        <RichTextToolbarButton
          icon={brush}
          title={LABEL_TOOLBAR_TITLE}
          onClick={handleToolbarClick}
          isActive={isActive}
        />
      </div>
      {!isActive && isAddComicHeadline && (
        <ComicHeadlineUI
          onClose={() => SetIsAddComicHeadline(false)}
          onChange={applyComicHeadline}
          popoverAnchor={popoverAnchor}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontName={fontName}
          setFontName={setFontName}
        />
      )}
    </>
  );
};
registerFormatType("magic-text/comic-headline", {
  title: __("Comic Headline", textDomain) || "Comic Headline",
  className: "magic-text-comic-headline-effect",
  tagName: "span",
  attributes: {
    style: "style",
  },
  edit: ComicHeadline,
});
