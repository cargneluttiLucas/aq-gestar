const API_DOMAIN = '';

export const environment = {
  production: false,
  addresses: {
    digitalPayments: {
      authsById: `${API_DOMAIN}digital_payments/auths/`,
      authsFilter: `${API_DOMAIN}digital_payments/auths/filter`,
      waitingAuthsById: `${API_DOMAIN}digital_payments/waiting_auths/`,
      waitingAuths: `${API_DOMAIN}digital_payments/waiting_auths`,
      transactions: `${API_DOMAIN}digital_payments/transactions`,
    },
  },
  seo: {
    gtmId : 'GTM-T9B7BT2',
    gtmSecretKey: '',
    logging : true,
    canonicalDomain: 'https://www.naranja.com',
  },
};
