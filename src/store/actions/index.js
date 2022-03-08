export const RESPONSE_API = 'RESPONSE_API';

export const responseAPI = (payload) => (
  {
    type: RESPONSE_API,
    payload,
  }
);
