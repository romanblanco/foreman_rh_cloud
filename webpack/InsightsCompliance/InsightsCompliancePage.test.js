import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import InsightsCompliancePage from './InsightsCompliancePage';

jest.mock('foremanReact/Root/Context/ForemanContext', () => ({
  useForemanContext: () => ({
    metadata: {
      permissions: new Set(['view_compliance']),
    },
  }),
  useForemanPermissions: () => new Set(['view_compliance']),
}));

describe('InsightsCompliancePage', () => {
  it('renders the compliance iframe container', () => {
    render(
      <MemoryRouter
        initialEntries={['/foreman_rh_cloud/insights_compliance/reports']}
      >
        <InsightsCompliancePage />
      </MemoryRouter>
    );

    expect(
      document.querySelector('.rh-cloud-insights-compliance-page')
    ).toBeTruthy();
    const src = new URL(
      screen.getByTestId('compliance-iframe').getAttribute('src')
    );
    expect(`${src.origin}${src.pathname}`).toBe(
      `${window.location.origin}/assets/apps/compliance/index.html`
    );
    expect(src.searchParams.get('frc_reload')).toMatch(/^\d+$/);
  });
});
