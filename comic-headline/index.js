// import "./style.scss";
import { __ } from "@wordpress/i18n";
import { brush } from "@wordpress/icons";
import { useState, useCallback } from "@wordpress/element";
import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import {
  Popover,
  Button,
  FontSizePicker,
  RadioControl,
} from "@wordpress/components";
import  { FontOptions, FontSizes, FallbackFontSize }  from "./FontOptions";

console.log(FontOptions)

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
}) => {


  return (
    <Popover anchor={popoverAnchor} className="magic-text-bg-popover">
      <div style={{ minWidth: "320px", padding: "16px" }}>
        <h4 style={{ marginBottom: "12px" }}>{LABEL_POPOVER_TITLE}</h4>

        <RadioControl
          label={__("Font Family", textDomain) || "Font Family"}
		  help={__("Select a font family", textDomain) || "Select a font family"}
          selected={fontFamily}
          options={FontOptions}
          onChange={(newFontFamily) => setFontFamily(newFontFamily)}
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
  const [fontSize, setFontSize] = useState("20");

  const applyComicHeadline = useCallback(() => {
    onChange(
      toggleFormat(value, {
        type: "magic-text/comic-headline",
        attributes: {
          style: `--font-family: ${fontFamily}; --text-size: ${fontSize}`,
		  style: `font-family: ${fontFamily}; font-size: ${fontSize}px`,
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
        />
      )}
    </>
  );
};
registerFormatType("magic-text/comic-headline", {
  title: __("Comic Headline", textDomain) || "Comic Headline",
  className: "magic-text-comic-headline",
  tagName: "span",
  attributes: {
    style: "style",
  },
  edit: ComicHeadline,
});
