import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { PluginDocumentSettingPanel } from "@wordpress/editor";
import { ToggleControl } from "@wordpress/components";
import { registerPlugin } from "@wordpress/plugins";

const textDomain = "magic-text";
const LABEL_SETTING_PANEL_TITLE =
  __("Display Mode", textDomain) || "Display Mode";

const ThemeDocumentSettingsPanel = () => {
  const [enableThemeSelector, setEnableThemeSelector] = useState(false);

  const { displayMode } = useSelect((select) => ({
    displayMode:
      select("core/editor").getEditedPostAttribute("meta")?.[
        "magic-text-theme"
      ] || "default",
  }));

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
          label={
            __("Enable Theme Selector", textDomain) || "Enable Theme Selector"
          }
          checked={enableThemeSelector}
          onChange={(checked) => {
            setEnableThemeSelector(checked);
            if (!checked) {
              editPost({ meta: { "magic-text-theme": "default" } });
            }
          }}
        />

        {enableThemeSelector && (
          <>
            <label htmlFor="magic-text-display-mode">
              {__("Display Mode", textDomain) || "Display Mode"}
            </label>
            <select
              id="magic-text-display-mode"
              name="magic-text-display-mode"
              value={displayMode}
              onChange={(e) => {
                editPost({ meta: { "magic-text-theme": e.target.value } });
              }}
            >
              <option value="default">
                {__("Default", textDomain) || "Default"}
              </option>
              <option value="dark">{__("Dark", textDomain) || "Dark"}</option>
              <option value="desert">
                {__("Desert", textDomain) || "Desert"}
              </option>
              <option value="night-sky">
                {__("Night Sky", textDomain) || "Night Sky"}
              </option>
              <option value="twilight">
                {__("Twilight", textDomain) || "Twilight"}
              </option>
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
