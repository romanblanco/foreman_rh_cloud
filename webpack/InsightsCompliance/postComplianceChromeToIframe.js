import { COMPLIANCE_IFRAME_MESSAGE_TYPE } from './complianceIframeConstants';
import { getComplianceAppRoute } from './complianceIframeHelpers';
import { mockUser } from '../common/ScalprumModule/ScalprumContext';

/**
 * Sends chrome/RBAC context into the compliance iframe after it loads.
 *
 * @param {HTMLIFrameElement} iframe
 * @param {Object} options
 * @param {Array} options.permissions Insights-format permissions from useInsightsPermissions
 * @param {string} options.pathname Foreman pathname for initial in-app routing
 */
export const postComplianceChromeToIframe = (
  iframe,
  { permissions = [], pathname = '' } = {}
) => {
  if (!iframe?.contentWindow || typeof window === 'undefined') {
    return;
  }

  iframe.contentWindow.postMessage(
    {
      type: COMPLIANCE_IFRAME_MESSAGE_TYPE,
      payload: {
        user: mockUser,
        permissions,
        appRoute: getComplianceAppRoute(pathname),
        pathname,
      },
    },
    window.location.origin
  );
};
