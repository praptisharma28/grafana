import { css } from '@emotion/css';
import React, { useMemo, useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { SceneComponentProps, SceneObjectBase, SceneObjectState } from '@grafana/scenes';
import {
  ButtonGroup,
  Field,
  FilterInput,
  Input,
  RadioButtonGroup,
  Select,
  Switch,
  TextArea,
  ToolbarButton,
  useStyles2,
} from '@grafana/ui';
import { OptionsPaneCategory } from 'app/features/dashboard/components/PanelEditor/OptionsPaneCategory';
import { getAllPanelPluginMeta } from 'app/features/panel/state/util';

import { PanelVizTypePicker } from './PanelVizTypePicker';
import { VizPanelManager } from './VizPanelManager';

const directionOptions = [
  { label: 'Horizontal', value: 'h' },
  { label: 'Vertical', value: 'v' },
];
const maxPerRowOptions = [2, 3, 4, 6, 8, 12].map((value) => ({ label: value.toString(), value }));

export interface PanelOptionsPaneState extends SceneObjectState {}

export class PanelOptionsPane extends SceneObjectBase<PanelOptionsPaneState> {
  public panelManager: VizPanelManager;

  public constructor(panelMgr: VizPanelManager) {
    super({});

    this.panelManager = panelMgr;
  }

  static Component = ({ model }: SceneComponentProps<PanelOptionsPane>) => {
    const { panelManager } = model;
    const { panel } = panelManager.state;
    const { title, description, displayMode, pluginId } = panel.useState();
    const styles = useStyles2(getStyles);
    const [isVizPickerOpen, setVizPickerOpen] = useState(true);

    return (
      <div className={styles.wrapper}>
        {!isVizPickerOpen && (
          <VisualizationButton
            pluginId={pluginId}
            onClick={() => {
              setVizPickerOpen(true);
            }}
          />
        )}
        <div className={styles.box}>
          {isVizPickerOpen && (
            <PanelVizTypePicker panelManager={panelManager} onChange={() => setVizPickerOpen(false)} />
          )}
          {!isVizPickerOpen && (
            <>
              <FilterInput value={''} placeholder="Search options" onChange={() => {}} />
              <RadioButtonGroup
                options={[
                  { label: 'All', value: 'All' },
                  { label: 'Overrides', value: 'Overrides' },
                ]}
                value={'All'}
                fullWidth
              ></RadioButtonGroup>
              <OptionsPaneCategory id="test" title="Panel options">
                <Field label="Title">
                  <Input value={title} onChange={(evt) => panel.setState({ title: evt.currentTarget.value })} />
                </Field>
                <Field label="Description">
                  <TextArea
                    id="description-text-area"
                    value={description}
                    onChange={(evt) => panel.setState({ description: evt.currentTarget.value })}
                  />
                </Field>
                <Field label="Transparent background">
                  <Switch
                    value={displayMode === 'transparent'}
                    onChange={(e) =>
                      panel.setState({ displayMode: displayMode === 'transparent' ? 'default' : 'transparent' })
                    }
                  />
                </Field>
                <OptionsPaneCategory id="panel-links" title="Panel Links">
                  <Field label="Panel links">
                    <>TBD...</>
                  </Field>
                </OptionsPaneCategory>
                <OptionsPaneCategory id="repeat-options" title="Repeat options" isOpenDefault={false}>
                  <Field
                    title="Repeat by variable"
                    description="Repeat this panel for each value in the selected variable. This is not visible while in edit mode. You need to go back to dashboard and then update the variable or reload the dashboard."
                  >
                    <>TBD...</>
                  </Field>
                  <Field title="Repeat direction">
                    <RadioButtonGroup
                      options={directionOptions}
                      value={'h'}
                      // onChange={(value) => onPanelConfigChange('repeatDirection', value)}
                    />
                  </Field>
                  <Field title="Max per row">
                    <Select
                      options={maxPerRowOptions}
                      value={2}
                      // onChange={(value) => onPanelConfigChange('maxPerRow', value.value)}
                      onChange={() => {}}
                    />
                  </Field>
                </OptionsPaneCategory>
              </OptionsPaneCategory>
            </>
          )}
        </div>
      </div>
    );
  };
}

function getStyles(theme: GrafanaTheme2) {
  return {
    box: css({
      display: 'flex',
      flexDirection: 'column',
      flexGrow: '1',
      padding: theme.spacing(1),
      background: theme.colors.background.primary,
      border: `1px solid ${theme.colors.border.weak}`,
      gap: theme.spacing(1),
    }),
    wrapper: css({
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      flexGrow: '1',
    }),
  };
}

export const VisualizationButton = ({ pluginId, onClick }: { pluginId: string; onClick: () => void }) => {
  // const dispatch = useDispatch();
  // const plugin = useSelector(getPanelPluginWithFallback(panel.type));
  // const isPanelOptionsVisible = useSelector((state) => state.panelEditor.ui.isPanelOptionsVisible);
  // const isVizPickerOpen = useSelector((state) => state.panelEditor.isVizPickerOpen);

  // const onToggleOpen = () => {
  //   dispatch(toggleVizPicker(!isVizPickerOpen));
  // };

  // const onToggleOptionsPane = () => {
  //   dispatch(updatePanelEditorUIState({ isPanelOptionsVisible: !isPanelOptionsVisible }));
  // };

  // if (!plugin) {
  //   return null;
  // }

  const pluginMeta = useMemo(() => getAllPanelPluginMeta().filter((p) => p.id === pluginId)[0], [pluginId]);

  return (
    <div className={vizButtonStyles.wrapper}>
      <ButtonGroup>
        <ToolbarButton
          className={vizButtonStyles.vizButton}
          tooltip="Click to change visualization"
          imgSrc={pluginMeta.info.logos.small}
          // isOpen={isVizPickerOpen}
          onClick={onClick}
          data-testid={selectors.components.PanelEditor.toggleVizPicker}
          aria-label="Change Visualization"
          variant="canvas"
          fullWidth
        >
          {pluginMeta.name}
        </ToolbarButton>
        {/* <ToolbarButton
          tooltip={isPanelOptionsVisible ? 'Close options pane' : 'Show options pane'}
          icon={isPanelOptionsVisible ? 'angle-right' : 'angle-left'}
          onClick={onToggleOptionsPane}
          variant="canvas"
          data-testid={selectors.components.PanelEditor.toggleVizOptions}
          aria-label={isPanelOptionsVisible ? 'Close options pane' : 'Show options pane'}
        /> */}
      </ButtonGroup>
    </div>
  );
};

const vizButtonStyles = {
  wrapper: css({
    display: 'flex',
    flexDirection: 'column',
  }),
  vizButton: css({
    textAlign: 'left',
  }),
};
