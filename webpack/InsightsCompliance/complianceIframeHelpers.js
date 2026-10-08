import {
  COMPLIANCE_ROUTE_PREFIX,
  COMPLIANCE_STATIC_APP_PATH,
} from './complianceIframeConstants';
import {
  getIopAppRoute,
  getIopForemanPath,
  getIopIframeSrc,
} from '../common/IopIframe/iopIframeHelpers';

const COMPLIANCE_IOP_PATH = {
  routePrefix: COMPLIANCE_ROUTE_PREFIX,
  fallbackRoute: 'reports',
};

// Reuse one URL during this parent-page lifetime, but bypass previously cached
// entry HTML when Foreman is loaded again after a frontend deployment.
const COMPLIANCE_ENTRY_VERSION = Date.now().toString();

export const getComplianceForemanPath = (appRoute = 'reports') =>
  getIopForemanPath(appRoute, COMPLIANCE_IOP_PATH);

export const getComplianceAppRoute = (pathname = '') =>
  getIopAppRoute(pathname, COMPLIANCE_IOP_PATH);

export const getComplianceIframeSrc = () => {
  const src = getIopIframeSrc(COMPLIANCE_STATIC_APP_PATH);
  return `${src}?frc_reload=${COMPLIANCE_ENTRY_VERSION}`;
};
