import React, { memo } from "react";
import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";
import EditableText, {
  EditInteractionKind,
} from "components/editorComponents/EditableText";
import { removeSpecialChars } from "utils/helpers";
import type { AppState } from "ee/reducers";

import { saveActionName } from "actions/pluginActionActions";
import { Flex } from "@appsmith/ads";
import { getActionByBaseId, getPlugin } from "ee/selectors/entitiesSelector";
import NameEditorComponent, {
  IconBox,
  IconWrapper,
  NameWrapper,
} from "components/utils/NameEditorComponent";
import {
  ACTION_ID_NOT_FOUND_IN_URL,
  ACTION_NAME_PLACEHOLDER,
  createMessage,
} from "ee/constants/messages";
import { getAssetUrl } from "ee/utils/airgapHelpers";
import { getSavingStatusForActionName } from "selectors/actionSelectors";
import type { ReduxAction } from "ee/constants/ReduxActionConstants";

interface SaveActionNameParams {
  id: string;
  name: string;
}
interface ActionNameEditorProps {
  /*
    This prop checks if page is API Pane or Query Pane or Curl Pane
    So, that we can toggle between ads editable-text component and existing editable-text component
    Right now, it's optional so that it doesn't impact any other pages other than API Pane.
    In future, when default component will be ads editable-text, then we can remove this prop.
  */
  enableFontStyling?: boolean;
  disabled?: boolean;
  saveActionName?: (
    params: SaveActionNameParams,
  ) => ReduxAction<SaveActionNameParams>;
}

function ActionNameEditor(props: ActionNameEditorProps) {
  const params = useParams<{ baseApiId?: string; baseQueryId?: string }>();

  const currentActionConfig = useSelector((state: AppState) =>
    getActionByBaseId(state, params.baseApiId || params.baseQueryId || ""),
  );

  const currentPlugin = useSelector((state: AppState) =>
    getPlugin(state, currentActionConfig?.pluginId || ""),
  );

  const saveStatus = useSelector((state) =>
    getSavingStatusForActionName(state, currentActionConfig?.id || ""),
  );

  return (
    <NameEditorComponent
      /**
       * This component is used by module editor in EE which uses a different
       * action to save the name of an action. The current callers of this component
       * pass the existing saveAction action but as fallback the saveActionName is used here
       * as a guard.
       */
      dispatchAction={props.saveActionName || saveActionName}
      id={currentActionConfig?.id}
      idUndefinedErrorMessage={ACTION_ID_NOT_FOUND_IN_URL}
      name={currentActionConfig?.name}
      saveStatus={saveStatus}
    >
      {({
        forceUpdate,
        handleNameChange,
        isInvalidNameForEntity,
        isNew,
        saveStatus,
      }: {
        forceUpdate: boolean;
        handleNameChange: (value: string) => void;
        isInvalidNameForEntity: (value: string) => string | boolean;
        isNew: boolean;
        saveStatus: { isSaving: boolean; error: boolean };
      }) => (
        <NameWrapper enableFontStyling={props.enableFontStyling}>
          <Flex
            alignItems="center"
            gap="spaces-3"
            overflow="hidden"
            width="100%"
          >
            {currentPlugin && (
              <IconBox>
                <IconWrapper
                  alt={currentPlugin.name}
                  src={getAssetUrl(currentPlugin?.iconLocation)}
                />
              </IconBox>
            )}
            <EditableText
              className="t--action-name-edit-field"
              defaultValue={currentActionConfig ? currentActionConfig.name : ""}
              disabled={props.disabled}
              editInteractionKind={EditInteractionKind.SINGLE}
              errorTooltipClass="t--action-name-edit-error"
              forceDefault={forceUpdate}
              isEditingDefault={isNew}
              isInvalid={isInvalidNameForEntity}
              onTextChanged={handleNameChange}
              placeholder={createMessage(ACTION_NAME_PLACEHOLDER, "Api")}
              type="text"
              underline
              updating={saveStatus.isSaving}
              valueTransform={removeSpecialChars}
            />
          </Flex>
        </NameWrapper>
      )}
    </NameEditorComponent>
  );
}

export default memo(ActionNameEditor);
