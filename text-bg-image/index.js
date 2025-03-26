import "./style.scss";
import { __ } from "@wordpress/i18n";
import { useState, useCallback, useMemo } from "@wordpress/element";
import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import {
  RichTextToolbarButton,
  MediaUpload,
  MediaUploadCheck,
} from "@wordpress/block-editor";
import { Popover, Button } from "@wordpress/components";

const textDomain = "magic-text";

const LABEL_POPOVER_TITLE =
  __("Custmze the Text background image", textDomain) ||
  "Text Bg ImagCustmze the Text background image";

const LABEL_TOOLBAR_TITLE = __("Text bg image", textDomain) || "Text Bg Image";

const TextBgImageUI = ({ onClose, onChange, setImageUrl, popoverAnchor }) => {
  const ALLOWED_MEDIA_TYPES = ["image"];
  const LABEL_OPEN_MEDIA =
    __("Open Media Library", textDomain) || "Open Media Library";
  return (
    <Popover
      anchor={popoverAnchor}
      className="magic-text-bg-popover" // Add custom class
    >
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
        <Button
          variant="primary"
          onClick={() => {
            onChange();
            onClose();
          }}
          style={{ width: "100%" }}
        >
          Apply
        </Button>
      </div>
    </Popover>
  );
};

const TextBgImage = ({ value, onChange, isActive }) => {
  const [isAddingTxtBg, setIsAddingTxtBg] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState();
  const [imageUrl, setImageUrl] = useState("");

  const applyTxtBg = useCallback(() => {
    onChange(
      toggleFormat(value, {
        type: "magic-text/text-bg-image",
        attributes: {
          style: `--text-bg-image: url('${imageUrl}')`,
          class: "magic-text-bg-image",
        },
      })
    );
  }, [onChange, value, imageUrl]);
  return (
    <>
      <div ref={setPopoverAnchor}>
        <RichTextToolbarButton
          icon="editor-code"
          title={LABEL_TOOLBAR_TITLE}
          onClick={() => setIsAddingTxtBg(true)}
          isActive={isActive}
        />
      </div>
      {isAddingTxtBg && (
        <TextBgImageUI
          onClose={() => setIsAddingTxtBg(false)}
          onChange={applyTxtBg}
          setImageUrl={setImageUrl}
          popoverAnchor={popoverAnchor}
        />
      )}
    </>
  );
};
registerFormatType("magic-text/text-bg-image", {
  title: __("Text bg"),
  className: null,
  tagName: "mark",
  attributes: {
    style: "style",
  },
  edit: TextBgImage,
});
