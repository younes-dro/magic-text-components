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
}) => {
  return (
    <Popover anchor={popoverAnchor} className="gradient-stroke-popover">
      <h4>{__("Gradient Stroke Settings", "magic-text")}</h4>

      <GradientPicker
        value={gradient}
        onChange={setGradient}
        label={__("Stroke Gradient", "magic-text")}
      />

      <RangeControl
        label={__("Stroke Width", "magic-text")}
        value={strokeWidth}
        onChange={setStrokeWidth}
        min={0.1}
        max={5}
        step={0.1}
        initialPosition={1}
      />

      <Button variant="primary" onClick={onChange}>
        {__("Apply", "magic-text")}
      </Button>
    </Popover>
  );
};

const GradientStroke = ({ isActive, value, onChange }) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState();
  const [gradient, setGradient] = useState(
    "linear-gradient(135deg, #09f1b8, #00a2ff, #ff00d2, #fed90f)"
  );
  const [strokeWidth, setStrokeWidth] = useState(1);

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

  return (
    <>
      <div ref={setPopoverAnchor}>
        <RichTextToolbarButton
          icon="admin-appearance"
          title={__("Gradient Stroke", "magic-text")}
          onClick={() => setIsPopoverVisible(!isPopoverVisible)}
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
        />
      )}
    </>
  );
};

registerFormatType("magic-text/gradient-stroke", {
  title: __("Gradient Stroke", "magic-text"),
  tagName: "bdo", // Using <bdo> tag to avoid conflicts
  className: "magic-gradient-stroke",
  attributes: {
    style: "style",
    class: "class",
  },
  edit: GradientStroke,
});
