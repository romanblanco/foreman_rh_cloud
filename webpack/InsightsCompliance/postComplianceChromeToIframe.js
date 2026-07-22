import { COMPLIANCE_IFRAME_MESSAGE_TYPE } from './complianceIframeConstants';
import { getComplianceAppRoute } from './complianceIframeHelpers';
import { mockUser } from '../common/ScalprumModule/ScalprumContext';

/**
 * Sends chrome/RBAC context into the compliance iframe after it loads.
 *
 * @param {HTMLIFrameElement} iframe
 * @param {Object} options
 * @param {Array} options.permissions Insights-format permissions from useInsightsPermissions
 * @param {string} [options.pathname] Foreman pathname (used when appRoute is omitted)
 * @param {string} [options.appRoute] Explicit in-app route (e.g. systems/<uuid>); overrides pathname
 * @param {string} [options.embedded] Embedding mode for the iframe (e.g. 'host-tab')
 */
export const postComplianceChromeToIframe = (
  iframe,
  { permissions = [], pathname = '', appRoute, embedded } = {}
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
        appRoute:
          appRoute !== undefined
            ? appRoute
            : getComplianceAppRoute(pathname),
        pathname,
        ...(embedded ? { embedded } : {}),
      },
    },
    window.location.origin
  );
};
