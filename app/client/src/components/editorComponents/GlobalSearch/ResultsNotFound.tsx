import React from "react";
import styled from "styled-components";
import NoSearchDataImage from "assets/images/no_search_data.png";
import { NO_SEARCH_DATA_TEXT } from "ee/constants/messages";
import { getTypographyByKey } from "@appsmith/ads-old";
import AnalyticsUtil from "ee/utils/AnalyticsUtil";
import { isAirgapped } from "ee/utils/airgapHelpers";
import { importSvg } from "@appsmith/ads-old";
import { DISCORD_URL } from "constants/ThirdPartyConstants";

const DiscordIcon = importSvg(
  async () => import("assets/icons/help/discord.svg"),
);

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  ${getTypographyByKey("spacedOutP1")}
  color: ${(props) => props.theme.colors.globalSearch.emptyStateText};

  .no-data-title {
    margin-top: ${(props) => props.theme.spaces[3]}px;
  }

  .discord {
    margin: ${(props) => props.theme.spaces[3]}px 0;
    display: flex;
    gap: 0.25rem;
  }

  .discord-link {
    cursor: pointer;
    display: flex;
    color: ${(props) => props.theme.colors.globalSearch.searchItemText};
    font-weight: 700;
  }
`;

const StyledDiscordIcon = styled(DiscordIcon)`
  path {
    fill: #5c6bc0;
  }
  vertical-align: -7px;
`;

function ResultsNotFound() {
  const isAirgappedInstance = isAirgapped();
  return (
    <Container>
      <img alt="No data" src={NoSearchDataImage} />
      <div className="no-data-title">{NO_SEARCH_DATA_TEXT()}</div>
      {!isAirgappedInstance && (
        <span className="discord">
          🤖 Join our{"  "}
          <span
            className="discord-link"
            onClick={() => {
              window.open(DISCORD_URL, "_blank");
              AnalyticsUtil.logEvent("DISCORD_LINK_CLICK");
            }}
          >
            <StyledDiscordIcon color="red" height={22} width={24} />
            Discord Server
          </span>{" "}
          for more help.
        </span>
      )}
    </Container>
  );
}

export default React.memo(ResultsNotFound);
