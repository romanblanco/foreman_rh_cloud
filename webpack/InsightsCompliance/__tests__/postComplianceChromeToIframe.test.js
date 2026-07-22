import { postComplianceChromeToIframe } from '../postComplianceChromeToIframe';
import { COMPLIANCE_IFRAME_MESSAGE_TYPE } from '../complianceIframeConstants';

describe('postComplianceChromeToIframe', () => {
  it('posts appRoute override and embedded mode', () => {
    const postMessage = jest.fn();
    const iframe = { contentWindow: { postMessage } };

    postComplianceChromeToIframe(iframe, {
      permissions: [{ permission: 'compliance:policies:read' }],
      pathname: '/new/hosts/demo.example.com',
      appRoute: 'systems/uuid-1',
      embedded: 'host-tab',
    });

    expect(postMessage).toHaveBeenCalledWith(
      {
        type: COMPLIANCE_IFRAME_MESSAGE_TYPE,
        payload: {
          user: expect.any(Object),
          permissions: [{ permission: 'compliance:policies:read' }],
          appRoute: 'systems/uuid-1',
          pathname: '/new/hosts/demo.example.com',
          embedded: 'host-tab',
        },
      },
      window.location.origin
    );
  });

  it('derives appRoute from compliance pathname when override omitted', () => {
    const postMessage = jest.fn();
    const iframe = { contentWindow: { postMessage } };

    postComplianceChromeToIframe(iframe, {
      permissions: [],
      pathname: '/foreman_rh_cloud/insights_compliance/scappolicies',
    });

    expect(postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          appRoute: 'scappolicies',
        }),
      }),
      window.location.origin
    );
  });
});
