type ChainInfo = {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  iconUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
};

const params: ChainInfo[] = [
  {
    chainId: '0x64',
    chainName: 'Gnosis',
    rpcUrls: ['https://rpc.ankr.com/gnosis'],
    iconUrls: [
      'https://xdaichain.com/fake/example/url/xdai.svg',
      'https://xdaichain.com/fake/example/url/xdai.png',
    ],
    nativeCurrency: {
      name: 'xDAI',
      symbol: 'xDAI',
      decimals: 18,
    },
    blockExplorerUrls: ['https://blockscout.com/poa/xdai/'],
  },
  {
    chainId: '0xaa36a7',
    chainName: 'Sepolia',
    rpcUrls: ['https://rpc.notadegen.com/eth/sepolia'],
    iconUrls: [],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
  },
  {
    chainId: '0xa4b1',
    chainName: 'arbitrum',
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    iconUrls: [],
    nativeCurrency: {
      name: 'ARB',
      symbol: 'ARB',
      decimals: 18,
    },
    blockExplorerUrls: ['https://arbiscan.io/'],
  },
];

export function getChainInfoByChainId(chainId: string): ChainInfo | undefined {
  return params.find((chain) => chain.chainId === chainId);
}

// const chainIdToSearch = "0x64";
// const chainInfo = getChainInfoByChainId(chainIdToSearch);

// if (chainInfo) {
//   console.log("Found chain info:", chainInfo);
// } else {
//   console.log("Chain info not found for chainId:", chainIdToSearch);
// }
