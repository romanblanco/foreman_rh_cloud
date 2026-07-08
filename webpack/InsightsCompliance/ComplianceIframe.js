import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';

import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';
import {
  getComplianceForemanPath,
  getComplianceIframeSrc,
} from './complianceIframeHelpers';
import {
  IOP_COMPLIANCE_NAVIGATE,
  IOP_COMPLIANCE_READY,
} from './complianceIframeConstants';
import { postComplianceChromeToIframe } from './postComplianceChromeToIframe';

import './ComplianceIframe.scss';

const ComplianceIframe = ({ title }) => {
  const iframeRef = useRef(null);
  const history = useHistory();
  const { pathname } = useLocation();
  const permissions = useInsightsPermissions();
  const iframeSrc = getComplianceIframeSrc();
  const lastPostedAppRouteRef = useRef(null);

  const sendChromeContext = useCallback(() => {
    postComplianceChromeToIframe(iframeRef.current, {
      permissions,
      pathname,
    });
  }, [permissions, pathname]);

  useEffect(() => {
    sendChromeContext();
  }, [sendChromeContext]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === IOP_COMPLIANCE_READY) {
        sendChromeContext();
        return;
      }

      if (event.data?.type === IOP_COMPLIANCE_NAVIGATE) {
        const appRoute = event.data.payload?.appRoute || 'reports';

        if (appRoute === lastPostedAppRouteRef.current) {
          return;
        }

        const nextPath = getComplianceForemanPath(appRoute);

        if (pathname !== nextPath) {
          lastPostedAppRouteRef.current = appRoute;
          history.push(nextPath);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, [history, pathname, sendChromeContext]);

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
