type PaystackSetupConfig = {
  key: string;
  email: string;
  amount: number;
  ref: string;
  currency: string;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
};

declare global {
  interface Window {
    PaystackPop?: { setup: (config: PaystackSetupConfig) => { openIframe: () => void } };
  }
}

export {};
