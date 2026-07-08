import {
  COMPLIANCE_ROUTE_PREFIX,
  COMPLIANCE_STATIC_APP_PATH,
} from './complianceIframeConstants';

/**
 * Foreman browser path for a compliance app sub-route.
 *
 * @param {string} appRoute
 * @returns {string}
 */
export const getComplianceForemanPath = (appRoute = 'reports') => {
  const subRoute = String(appRoute).replace(/^\/+/, '');

  return subRoute
    ? `${COMPLIANCE_ROUTE_PREFIX}/${subRoute}`
    : `${COMPLIANCE_ROUTE_PREFIX}/reports`;
};

/**
 * Path inside the compliance SPA (e.g. `reports`, `scappolicies/new`).
 *
 * @param {string} pathname Foreman location pathname
 * @returns {string}
 */
export const getComplianceAppRoute = (pathname = '') => {
  if (!pathname.startsWith(COMPLIANCE_ROUTE_PREFIX)) {
    return 'reports';
  }

  const subRoute = pathname
    .slice(COMPLIANCE_ROUTE_PREFIX.length)
    .replace(/^\//, '');

  return subRoute || 'reports';
};

/**
 * Static compliance app entry served from Satellite assets.
 *
 * @returns {string}
 */
export const getComplianceIframeSrc = () => {
  if (typeof window === 'undefined') {
    return COMPLIANCE_STATIC_APP_PATH;
  }

  return `${window.location.origin}${COMPLIANCE_STATIC_APP_PATH}`;
};
