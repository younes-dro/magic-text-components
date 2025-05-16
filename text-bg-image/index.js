import "./style.scss";
import { __ } from "@wordpress/i18n";
import { useState, useCallback, useMemo } from "@wordpress/element";
import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import {
  RichTextToolbarButton,
  MediaUpload,
  MediaUploadCheck,
} from "@wordpress/block-editor";
import { Popover, Button, FontSizePicker } from "@wordpress/components";

const textDomain = "dro-magic-text";

const LABEL_POPOVER_TITLE =
  __("Custmze the Text background image", textDomain) ||
  "Text Bg ImagCustmze the Text background image";

const LABEL_TOOLBAR_TITLE = __("Text bg image", textDomain) || "Text Bg Image";

const LABEL_BUTTON_APPLY = __("Apply", textDomain) || "Apply";

const TextBgImageUI = ({
  onClose,
  onChange,
  setImageUrl,
  popoverAnchor,
  fontSize,
  setFontSize,
}) => {
  const ALLOWED_MEDIA_TYPES = ["image"];
  const LABEL_OPEN_MEDIA =
    __("Open Media Library", textDomain) || "Open Media Library";

  const fontSizes = [
    {
      name: __("Small"),
      slug: "small",
      size: 12,
    },
    {
      name: __("Big"),
      slug: "big",
      size: 26,
    },
  ];
  const fallbackFontSize = 16;

  return (
    <Popover anchor={popoverAnchor} className="dro-magic-text-bg-popover">
      <div style={{ minWidth: "320px", padding: "16px" }}>
        <h4 style={{ marginBottom: "12px" }}>{LABEL_POPOVER_TITLE}</h4>
        <MediaUploadCheck>
          <MediaUpload
            allowedTypes={ALLOWED_MEDIA_TYPES}
            onSelect={(media) => setImageUrl(media.url)}
            render={({ open }) => (
              <Button
                variant="primary"
                onClick={open}
                style={{ marginBottom: "12px", width: "100%" }}
              >
                {LABEL_OPEN_MEDIA}
              </Button>
            )}
          />
        </MediaUploadCheck>
        <FontSizePicker
          __next40pxDefaultSize
          fallbackFontSize={fallbackFontSize}
          fontSizes={fontSizes}
          value={fontSize}
          onChange={(newFontSize) => setFontSize(newFontSize)}
        />
        <Button
          variant="primary"
          onClick={() => {
            onChange();
            onClose();
          }}
          style={{ width: "100%" }}
        >
          {LABEL_BUTTON_APPLY}
        </Button>
      </div>
    </Popover>
  );
};

const TextBgImage = ({ value, onChange, isActive }) => {
  const [isAddingTxtBg, setIsAddingTxtBg] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [fontSize, setFontSize] = useState("20");

  const applyTxtBg = useCallback(() => {
    onChange(
      toggleFormat(value, {
        type: "dro-magic-text/text-bg-image",
        attributes: {
          style: `--text-bg-image: url('${imageUrl}'); --text-size: ${fontSize}`,
          class: "dro-magic-text-bg-image",
        },
      })
    );
  }, [onChange, value, imageUrl, fontSize]);

  const handleToolbarClick = useCallback(() => {
    if (isActive) {
      onChange(toggleFormat(value, { type: "dro-magic-text/text-bg-image" }));
    } else {
      setIsAddingTxtBg(true);
    }
  }, [isActive, onChange, value]);
  return (
    <>
      <div ref={setPopoverAnchor}>
        <RichTextToolbarButton
          icon="format-image"
          title={LABEL_TOOLBAR_TITLE}
          onClick={handleToolbarClick}
          isActive={isActive}
        />
      </div>
      {!isActive && isAddingTxtBg && (
        <TextBgImageUI
          onClose={() => setIsAddingTxtBg(false)}
          onChange={applyTxtBg}
          setImageUrl={setImageUrl}
          popoverAnchor={popoverAnchor}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />
      )}
    </>
  );
};
registerFormatType("dro-magic-text/text-bg-image", {
  title: __("Text bg", "dro-magic-text"),
  className: null,
  tagName: "mark",
  attributes: {
    style: "style",
  },
  edit: TextBgImage,
});
