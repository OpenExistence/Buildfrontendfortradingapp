/**
 * Web3 Service - Handles wallet connection and blockchain interactions
 * SECURITY: Uses MetaMask/browser wallet, never stores private keys
 */

import Web3 from 'web3';

export interface WalletInfo {
  address: string;
  chainId: number;
  networkName: string;
  balances: {
    [token: string]: string;
  };
}

export interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
  address?: string;
}

class Web3Service {
  private web3: Web3 | null = null;
  private account: string | null = null;

  // ERC20 ABI for balance checking
  private erc20Abi = [
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: 'balance', type: 'uint256' }],
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{ name: '', type: 'uint8' }],
      type: 'function'
    }
  ];

  // Common token addresses on Arbitrum
  private tokens = {
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    WBTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    ETH: 'native' // Native token
  };

  /**
   * Check if MetaMask is available
   */
  isMetaMaskAvailable(): boolean {
    return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
  }

  /**
   * Connect wallet via MetaMask
   */
  async connectWallet(): Promise<WalletInfo> {
    if (!this.isMetaMaskAvailable()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      const ethereum = (window as any).ethereum;

      // Request account access
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      this.account = accounts[0];
      this.web3 = new Web3(ethereum);

      // Get chain ID
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      const chainIdDecimal = parseInt(chainId, 16);

      // Get network name
      const networkName = this.getNetworkName(chainIdDecimal);

      // Get balances
      const balances = await this.getBalances(this.account);

      return {
        address: this.account,
        chainId: chainIdDecimal,
        networkName,
        balances
      };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnectWallet(): void {
    this.web3 = null;
    this.account = null;
  }

  /**
   * Get balances for native and ERC20 tokens
   */
  async getBalances(address: string): Promise<{ [token: string]: string }> {
    if (!this.web3) throw new Error('Web3 not initialized');

    const balances: { [token: string]: string } = {};

    try {
      // Get native ETH/ARB balance
      const ethBalance = await this.web3.eth.getBalance(address);
      balances['ETH'] = this.web3.utils.fromWei(ethBalance, 'ether');

      // Get ERC20 token balances
      for (const [symbol, tokenAddress] of Object.entries(this.tokens)) {
        if (tokenAddress === 'native') continue;

        try {
          const contract = new this.web3.eth.Contract(this.erc20Abi as any, tokenAddress);
          const balance = await contract.methods.balanceOf(address).call();
          const decimals = await contract.methods.decimals().call();

          balances[symbol] = (Number(balance) / Math.pow(10, Number(decimals))).toFixed(6);
        } catch (error) {
          console.error(`Error fetching ${symbol} balance:`, error);
          balances[symbol] = '0.000000';
        }
      }

      return balances;
    } catch (error) {
      console.error('Error fetching balances:', error);
      throw error;
    }
  }

  /**
   * Switch to Arbitrum network
   */
  async switchToArbitrum(): Promise<void> {
    if (!this.isMetaMaskAvailable()) {
      throw new Error('MetaMask is not installed');
    }

    const ethereum = (window as any).ethereum;

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xa4b1' }] // Arbitrum One
      });
    } catch (switchError: any) {
      // Chain not added to MetaMask
      if (switchError.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0xa4b1',
              chainName: 'Arbitrum One',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://arb1.arbitrum.io/rpc'],
              blockExplorerUrls: ['https://arbiscan.io/']
            }
          ]
        });
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Get network name from chain ID
   */
  private getNetworkName(chainId: number): string {
    const networks: { [key: number]: string } = {
      1: 'Ethereum Mainnet',
      42161: 'Arbitrum One',
      10: 'Optimism',
      137: 'Polygon',
      8453: 'Base',
      5: 'Goerli Testnet',
      421613: 'Arbitrum Goerli'
    };

    return networks[chainId] || `Unknown Network (${chainId})`;
  }

  /**
   * Get current account
   */
  getAccount(): string | null {
    return this.account;
  }

  /**
   * Listen to account changes
   */
  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (this.isMetaMaskAvailable()) {
      const ethereum = (window as any).ethereum;
      ethereum.on('accountsChanged', callback);
    }
  }

  /**
   * Listen to chain changes
   */
  onChainChanged(callback: (chainId: string) => void): void {
    if (this.isMetaMaskAvailable()) {
      const ethereum = (window as any).ethereum;
      ethereum.on('chainChanged', callback);
    }
  }
}

export const web3Service = new Web3Service();
