import { NETWORK_CONDITIONS } from '../constants/networkConditions';

export const REQUEST_STATUS = {
  idle: {
    headline: 'Nothing sent yet',
    sub: 'Choose a network above, then tap Send.',
    tone: 'muted',
  },
  loading: {
    headline: 'Request in progress…',
    sub: 'Imagine your user staring at a loading spinner.',
    tone: 'warning',
  },
  success: {
    headline: 'Request succeeded',
    sub: 'The app got data back from the (simulated) server.',
    tone: 'success',
  },
  error: {
    headline: 'Request failed',
    sub: 'This is what your user sees when the network misbehaves.',
    tone: 'error',
  },
  cancelled: {
    headline: 'Request cancelled',
    sub: 'You stopped the request before it finished.',
    tone: 'muted',
  },
};

export function getConditionOneLiner(conditionId) {
  const hints = {
    normal: 'Fast and reliable',
    slow3g: 'Everything feels slow',
    offline: 'Phone has no internet',
    timeout: 'Server takes too long',
    serverError: 'Server returns an error',
    unstable: 'Sometimes works, sometimes not',
  };
  return hints[conditionId] || NETWORK_CONDITIONS.normal.label;
}
