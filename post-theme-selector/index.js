import { __ } from "@wordpress/i18n";
import { ListAvailableThemes } from "./options";
import { useState, useEffect } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { PluginDocumentSettingPanel } from "@wordpress/editor";
import { ToggleControl } from "@wordpress/components";
import { registerPlugin } from "@wordpress/plugins";
import './themes';

const textDomain = "magic-text";
const LABEL_SETTING_PANEL_TITLE = __("Display Mode", textDomain);

const ThemeDocumentSettingsPanel = () => {
	const { savedTheme } = useSelect((select) => ({
		savedTheme: select("core/editor").getEditedPostAttribute("meta")?.magic_text_theme_meta
	}));

	const [enableThemeSelector, setEnableThemeSelector] = useState(
		() => savedTheme !== undefined && savedTheme !== "default"
	);

	const { editPost } = useDispatch("core/editor");


	useEffect(() => {

		const applyThemeClasses = () => {

			const iframeWrapper = document.querySelector('.block-editor-iframe__scale-container');
			const iframe = iframeWrapper?.querySelector('iframe');
			const iframeBody = iframe?.contentDocument?.body;

			const editorContainer = document.querySelector('.editor-styles-wrapper');

			const elementsToStyle = [iframeBody, editorContainer].filter(Boolean);

			elementsToStyle.forEach(element => {
				console.debug('1', element);
				element.classList.remove(
					...ListAvailableThemes.map(theme => `magic-theme-${theme.value}`)
				);

				element.classList.remove(
					...ListAvailableThemes.map(theme => `theme-${theme.value}`)
				);
			});


			if (enableThemeSelector && savedTheme && savedTheme !== "default") {
				// alert(`theme-${savedTheme}`);
				elementsToStyle.forEach(element => {
					console.debug('2', element);
					element.classList.add(`magic-theme-${savedTheme}`);
					element.classList.add(`theme-${savedTheme}`);
				});
			} else {
				// alert('none')
			}
		};

		setTimeout(() => applyThemeClasses(), 100);
		// applyThemeClasses();

		const observer = new MutationObserver((mutations) => {
			mutations.forEach(() => {
				const iframeWrapper = document.querySelector('.block-editor-iframe__scale-container');
				if (iframeWrapper) {
					const iframe = iframeWrapper.querySelector('iframe');
					if (iframe && iframe.contentDocument) {
						applyThemeClasses();
					}
				}
			});
		});

		const editorArea = document.querySelector('.block-editor-iframe__scale-container')?.parentNode;
		if (editorArea) {
			observer.observe(editorArea, {
				childList: true,
				subtree: true
			});
		}

		return () => {
			observer.disconnect();
		};
	}, [savedTheme, enableThemeSelector]);

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
						editPost({
							meta: {
								magic_text_theme_meta: checked
									? savedTheme || ListAvailableThemes[0].value
									: "default"
							}
						});
					}}
				/>

				{(enableThemeSelector || savedTheme) && (
					<div className="theme-selector-wrapper">
						<label htmlFor="magic-text-display-mode">
							{__("Display Mode", textDomain)}
						</label>
						<select
							id="magic-text-display-mode"
							value={savedTheme || "default"}
							onChange={(e) => {
								editPost({
									meta: { magic_text_theme_meta: e.target.value }
								});
							}}
						>
							{ListAvailableThemes.map((theme) => (
								<option key={theme.value} value={theme.value}>
									{__(theme.name, textDomain)}
								</option>
							))}
						</select>
					</div>
				)}
			</div>
		</PluginDocumentSettingPanel>
	);
};

registerPlugin("magic-text-post-theme-selector", {
	render: ThemeDocumentSettingsPanel,
	icon: "star-half",
});
