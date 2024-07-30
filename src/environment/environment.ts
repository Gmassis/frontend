const urlBackend = 'http://localhost:4444/v1';

export const environment = {
  api: {
    getProduct: `${urlBackend}/product`,
    register: `${urlBackend}/register`,
    login: `${urlBackend}/login`,
    createCart: `${urlBackend}/cart`,
    retrieveCart: `${urlBackend}/cart`,
    deleteCart: `${urlBackend}/cart`,
    checkout: `${urlBackend}/checkout`,
  },
};
