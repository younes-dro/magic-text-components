import { __ } from "@wordpress/i18n";
import { ListAvailableThemes } from "./options";
import { useState } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { PluginDocumentSettingPanel } from "@wordpress/editor";
import { ToggleControl } from "@wordpress/components";
import { registerPlugin } from "@wordpress/plugins";

const textDomain = "magic-text";
const LABEL_SETTING_PANEL_TITLE =
	__("Display Mode", textDomain) || "Display Mode";

const ThemeDocumentSettingsPanel = () => {

	// Get the saved theme from the post meta
	const { savedTheme } = useSelect((select) => (
		{
			savedTheme: select("core/editor").getEditedPostAttribute("meta")?.magic_text_theme_meta,
		}
	));

	const [enableThemeSelector, setEnableThemeSelector] = useState(
		savedTheme !== undefined
	);

	const { editPost } = useDispatch("core/editor");

	return (
		<PluginDocumentSettingPanel
			name="magic-text-display-mode"
			title={LABEL_SETTING_PANEL_TITLE}
			className="magic-text-post-theme-selector-panel"
			initialOpen={true}
		>
			<div className="magic-text-post-theme-selector-panel__content">
				<ToggleControl
					label={__("Enable Theme Selector", textDomain)}
					checked={enableThemeSelector}
					onChange={(checked) => {
						setEnableThemeSelector(checked);
						// Only save when disabling (setting to default)
						if (!checked) {
							editPost({
								meta: { magic_text_theme_meta: "default" },
							});
						}
					}}
				/>

				{(enableThemeSelector || savedTheme !== undefined) && (
					<>
						<label htmlFor="magic-text-display-mode">
							{__("Display Mode", textDomain)}
						</label>
						<select
							id="magic-text-display-mode"
							value={savedTheme || "default"}
							onChange={(e) => {
								editPost({
									meta: { magic_text_theme_meta: e.target.value },
								});
							}}
						>
							{ListAvailableThemes.map((theme, index) => {
								return (
									<option key={theme.value} value={theme.value}>
										{`${index}-${__(theme.name, textDomain)}`}
									</option>
								);
							})}
							;
						</select>
					</>
				)}
			</div>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin("magic-text-post-theme-selector", {
	render: ThemeDocumentSettingsPanel,
	icon: "star-half",
});
