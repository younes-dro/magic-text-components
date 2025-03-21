import { __ } from "@wordpress/i18n";
import { useMemo, useState } from "@wordpress/element";
import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
import { RichTextToolbarButton } from "@wordpress/block-editor";
import {
	Popover,
	ColorPicker,
	TextControl,
	Button,
} from "@wordpress/components";

const LABEL_GRADIENT_DEG = __("Gradient direction");
const LABEL_APPLY_BUTTON = __("Apply");

const GradientTextColor = ({ isActive, onChange, value }) => {
	const [isAddingGradient, setIsAddingGradient] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState();
	const [gradientStartColor, setGradientStartColor] = useState("#fff");
	const [gradientEndColor, setGradientEndColor] = useState("#000");
	const [gradientDeg, setGradientDeg] = useState("90deg");

	const onToggle = () => {
		setIsAddingGradient((state) => !state);
	};

	const applyGradient = () => {
		const gradientCSS = `linear-gradient(${gradientDeg}, ${gradientStartColor}, ${gradientEndColor})`;
		onChange(
			toggleFormat(value, {
				type: "magic-text/gradient",
				attributes: {
					style: `background: ${gradientCSS}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`,
				},
			}),
		);
		setIsAddingGradient(false);
	};

	const GradientDegText = () => {
		return (
			<TextControl
				label={LABEL_GRADIENT_DEG}
				value={gradientDeg}
				onChange={(value) => {
					// console.log("Gradient degree:", value);
					setGradientDeg(value);
				}}
			/>
		);
	};

	const ApplyGradientButton = () => {
		return (
			<Button variant="primary" onClick={applyGradient}>
				{LABEL_APPLY_BUTTON}
			</Button>
		);
	};

	return (
		<>
			<div ref={setPopoverAnchor} style={{ border: "1px solid blue" }}>
				<RichTextToolbarButton
					icon="editor-code"
					title="Gradient Text Color"
					onClick={onToggle}
					isActive={isActive}
				/>
			</div>
			{isAddingGradient && (
				<Popover
					animate={true}
					anchor={popoverAnchor}
					position="bottom right"
					offset={{ x: 10, y: 10 }}
					style={{ border: "2px solid red" }}
				>
					<h4>Select Gradient colors and deg</h4>
					<ColorPicker
						color={gradientStartColor}
						onChange={(startColor) => setGradientStartColor(startColor)}
					/>
					<ColorPicker
						color={gradientEndColor}
						onChange={(endColor) => setGradientEndColor(endColor)}
					/>
					<GradientDegText />
					<ApplyGradientButton />
				</Popover>
			)}
		</>
	);
};

registerFormatType("magic-text/gradient", {
	title: "Gradient",
	tagName: "span",
	className: null,
	attributes: {
		style: "style",
	},
	edit: GradientTextColor,
});
