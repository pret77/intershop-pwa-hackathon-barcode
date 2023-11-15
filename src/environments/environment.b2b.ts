import { overrides } from './environment.development';
import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  icmChannel: 'Lekkerland-Lekkerland24-Site',

  themeColor: '#688dc3',

  features: [
    ...ENVIRONMENT_DEFAULTS.features,
    'businessCustomerRegistration',
    'costCenters',
    'maps',
    'messageToMerchant',
    'punchout',
    'quickorder',
    'quoting',
    'orderTemplates',
  ],

  ...overrides,
};
