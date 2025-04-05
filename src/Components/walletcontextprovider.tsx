import dynamic from 'next/dynamic';

const WalletContextProviderInner = dynamic(
  () => import("./Walletconnect"),
  { ssr: false }
);

export default WalletContextProviderInner;