import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';
import { getComplianceIframeSrc } from './complianceIframeHelpers';
import { postComplianceChromeToIframe } from './postComplianceChromeToIframe';

import './ComplianceIframe.scss';

const ComplianceIframe = ({ title }) => {
  const iframeRef = useRef(null);
  const { pathname } = useLocation();
  const permissions = useInsightsPermissions();
  const iframeSrc = getComplianceIframeSrc();

  const sendChromeContext = useCallback(() => {
    postComplianceChromeToIframe(iframeRef.current, {
      permissions,
      pathname,
    });
  }, [permissions, pathname]);

  useEffect(() => {
    sendChromeContext();
  }, [sendChromeContext]);

  const handleLoad = () => {
    sendChromeContext();
  };

  return (
    <iframe
      ref={iframeRef}
      className="rh-cloud-insights-compliance-iframe"
      data-testid="compliance-iframe"
      src={iframeSrc}
      title={title}
      onLoad={handleLoad}
    />
  );
};

ComplianceIframe.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ComplianceIframe;
