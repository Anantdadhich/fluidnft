import dynamic from 'next/dynamic';

const WalletContextProviderInner = dynamic(
  () => import("../compo/Walletconnect"),
  { ssr: false }
);

export default WalletContextProviderInner;