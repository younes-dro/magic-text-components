import { __ } from "@wordpress/i18n";
import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import {
  Popover,
  GradientPicker,
  RangeControl,
  Button,
} from "@wordpress/components";
import { useState, useCallback } from "@wordpress/element";
import "./style.scss";

const GradientStrokeUI = ({
  onClose,
  onChange,
  gradient,
  setGradient,
  strokeWidth,
  setStrokeWidth,
  popoverAnchor,
  LABEL_POPOVER_TITLE,
  LABEL_GRADIENT_STROKE,
  LABEL_GRADIENT_WIDTH,
  LABEL_APPLY_BUTTON,
}) => {
  return (
    <Popover anchor={popoverAnchor} className="gradient-stroke-popover">
      <h4>{LABEL_POPOVER_TITLE}</h4>

      <GradientPicker
        value={gradient}
        onChange={setGradient}
        label={LABEL_GRADIENT_STROKE}
      />

      <RangeControl
        label={LABEL_GRADIENT_WIDTH}
        value={strokeWidth}
        onChange={setStrokeWidth}
        min={0.1}
        max={5}
        step={0.1}
        initialPosition={1}
      />

      <Button variant="primary" onClick={onChange}>
        {LABEL_APPLY_BUTTON}
      </Button>
    </Popover>
  );
};

const GradientStroke = ({
  isActive,
  value,
  onChange,
  textDomain = "magic-text",
}) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState();
  const [gradient, setGradient] = useState(
    "linear-gradient(to right, #09f1b8, #00a2ff, #ff00d2, #fed90f)"
  );
  const [strokeWidth, setStrokeWidth] = useState(1);

  const LABEL_POPOVER_TITLE =
    __("Gradient Stroke Settings", textDomain) || "Gradient Stroke Settings";
  const LABEL_GRADIENT_STROKE =
    __("Stroke Gradient", textDomain) || "Stroke Gradient";
  const LABEL_GRADIENT_WIDTH = __("Stroke Width", textDomain) || "Stroke Width";
  const LABEL_APPLY_BUTTON = __("Apply", textDomain) || "Apply";

  const applyGradientStroke = useCallback(() => {
    onChange(
      toggleFormat(value, {
        type: "magic-text/gradient-stroke",
        attributes: {
          style: `
            --gradient-stroke: ${gradient};
            --stroke-width: ${strokeWidth}px;
          `,
          class: "magic-gradient-stroke",
        },
      })
    );
  }, [gradient, strokeWidth, onChange, value]);

  const handleToolbarClick = useCallback(() => {
    if (isActive) {
      onChange(toggleFormat(value, { type: "magic-text/gradient-stroke" }));
    } else {
      setIsPopoverVisible(true);
    }
  }, [isActive, value, onChange]);

  return (
    <>
      <div ref={setPopoverAnchor}>
        <RichTextToolbarButton
          icon="admin-appearance"
          title={__("Gradient Stroke", "magic-text")}
          onClick={handleToolbarClick}
          isActive={isActive}
        />
      </div>
      {isPopoverVisible && (
        <GradientStrokeUI
          onClose={() => setIsPopoverVisible(false)}
          onChange={() => {
            applyGradientStroke();
            setIsPopoverVisible(false);
          }}
          gradient={gradient}
          setGradient={setGradient}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          popoverAnchor={popoverAnchor}
          LABEL_POPOVER_TITLE={LABEL_POPOVER_TITLE}
          LABEL_GRADIENT_STROKE={LABEL_GRADIENT_STROKE}
          LABEL_GRADIENT_WIDTH={LABEL_GRADIENT_WIDTH}
          LABEL_APPLY_BUTTON={LABEL_APPLY_BUTTON}
        />
      )}
    </>
  );
};

registerFormatType("magic-text/gradient-stroke", {
  title: __("Gradient Stroke", "magic-text"),
  tagName: "bdo", // Using <bdo> tag to avoid conflicts
  className: null,
  attributes: {
    style: "style",
    class: "class",
  },
  edit: GradientStroke,
});
