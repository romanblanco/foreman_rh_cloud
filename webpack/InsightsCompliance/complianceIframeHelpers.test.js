import {
  getComplianceAppRoute,
  getComplianceIframeSrc,
} from './complianceIframeHelpers';

describe('complianceIframeHelpers', () => {
  describe('getComplianceAppRoute', () => {
    it('maps foreman compliance paths to app routes', () => {
      expect(
        getComplianceAppRoute('/foreman_rh_cloud/insights_compliance/reports')
      ).toBe('reports');
      expect(
        getComplianceAppRoute(
          '/foreman_rh_cloud/insights_compliance/reports/report-1'
        )
      ).toBe('reports/report-1');
      expect(
        getComplianceAppRoute(
          '/foreman_rh_cloud/insights_compliance/scappolicies/new'
        )
      ).toBe('scappolicies/new');
    });

    it('defaults to reports for unknown paths', () => {
      expect(getComplianceAppRoute('/foreman_rh_cloud/insights_cloud')).toBe(
        'reports'
      );
    });
  });

  describe('getComplianceIframeSrc', () => {
    it('returns the static compliance app entry', () => {
      expect(getComplianceIframeSrc()).toBe(
        `${window.location.origin}/assets/apps/compliance/index.html`
      );
    });
  });
});
