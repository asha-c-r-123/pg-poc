import React from "react";
import { Tooltip } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

export const TooltipProjectName = ({ name }) => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {name}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="bottom"
      //   defaultShow={true}
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <span className="text-ellipses"> {name}</span>
    </OverlayTrigger>
  );
};
