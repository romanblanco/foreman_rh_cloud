import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { useInsightsPermissions } from '../common/Hooks/PermissionsHooks';
import {
  isNotRhelHost,
  hasNoInsightsFacet,
  useTabRedirect,
} from '../ForemanRhCloudHelpers';
import { getComplianceIframeSrc } from '../InsightsCompliance/complianceIframeHelpers';
import { IOP_COMPLIANCE_READY } from '../InsightsCompliance/complianceIframeConstants';
import { postComplianceChromeToIframe } from '../InsightsCompliance/postComplianceChromeToIframe';
import './ComplianceHostDetailsTab.scss';

const ComplianceHostDetailsTab = ({ inventoryId }) => {
  const iframeRef = useRef(null);
  const permissions = useInsightsPermissions();
  const iframeSrc = getComplianceIframeSrc();
  const appRoute = `systems/${inventoryId}`;

  const sendChromeContext = useCallback(() => {
    postComplianceChromeToIframe(iframeRef.current, {
      permissions,
      appRoute,
      embedded: 'host-tab',
    });
  }, [permissions, appRoute]);

  useEffect(() => {
    sendChromeContext();
  }, [sendChromeContext]);

  useEffect(() => {
    const handleMessage = event => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === IOP_COMPLIANCE_READY) {
        sendChromeContext();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, [sendChromeContext]);

  return (
    <div className="rh-cloud-insights-compliance-host-details-component compliance">
      <iframe
        key={inventoryId}
        ref={iframeRef}
        className="rh-cloud-insights-compliance-host-details-iframe"
        data-testid="compliance-host-details-iframe"
        src={iframeSrc}
        title={__('Compliance')}
        onLoad={sendChromeContext}
      />
    </div>
  );
};

ComplianceHostDetailsTab.propTypes = {
  inventoryId: PropTypes.string.isRequired,
};

const ComplianceHostDetailsTabWrapper = ({ response }) => {
  const isHostDataLoaded = Boolean(response?.id);
  const shouldHideTab = useTabRedirect(
    isHostDataLoaded &&
      (isNotRhelHost({ hostDetails: response }) ||
        hasNoInsightsFacet({ response, hostDetails: response }))
  );

  if (shouldHideTab) {
    return null;
  }

  const inventoryId = response?.subscription_facet_attributes?.uuid;

  if (!inventoryId) {
    return null;
  }

  return <ComplianceHostDetailsTab inventoryId={inventoryId} />;
};

ComplianceHostDetailsTabWrapper.propTypes = {
  response: PropTypes.shape({
    id: PropTypes.number,
    operatingsystem_name: PropTypes.string,
    insights_attributes: PropTypes.object,
    subscription_facet_attributes: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }),
};

ComplianceHostDetailsTabWrapper.defaultProps = {
  response: {},
};

export default ComplianceHostDetailsTabWrapper;
