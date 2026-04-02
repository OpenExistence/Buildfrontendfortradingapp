import { useState, useEffect } from 'react';
import { Wallet, Copy, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { web3Service, WalletInfo } from '../services/web3Service';

interface WalletManagerProps {
  onWalletConnect: (address: string) => void;
}

export function WalletManager({ onWalletConnect }: WalletManagerProps) {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Listen to account changes
    web3Service.onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        handleDisconnect();
      } else {
        handleConnect();
      }
    });

    // Listen to chain changes
    web3Service.onChainChanged(() => {
      window.location.reload();
    });
  }, []);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!web3Service.isMetaMaskAvailable()) {
        setError('MetaMask is not installed. Please install MetaMask extension.');
        setLoading(false);
        return;
      }

      const info = await web3Service.connectWallet();
      setWalletInfo(info);
      setIsConnected(true);
      onWalletConnect(info.address);

      // If not on Arbitrum, prompt to switch
      if (info.chainId !== 42161) {
        try {
          await web3Service.switchToArbitrum();
          // Refresh wallet info after switching
          const updatedInfo = await web3Service.connectWallet();
          setWalletInfo(updatedInfo);
        } catch (switchError) {
          console.error('Failed to switch network:', switchError);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    web3Service.disconnectWallet();
    setWalletInfo(null);
    setIsConnected(false);
  };

  const handleRefresh = async () => {
    if (!walletInfo) return;

    setRefreshing(true);
    try {
      const updatedInfo = await web3Service.connectWallet();
      setWalletInfo(updatedInfo);
    } catch (err) {
      console.error('Failed to refresh balances:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const copyAddress = () => {
    if (walletInfo) {
      navigator.clipboard.writeText(walletInfo.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-blue-600" />
        <h2 className="font-semibold text-lg">Wallet Management</h2>
      </div>

      {isConnected && walletInfo ? (
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">Wallet Connected</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 font-mono">
                {walletInfo.address.slice(0, 10)}...{walletInfo.address.slice(-8)}
              </span>
              <button
                onClick={copyAddress}
                className="p-1.5 hover:bg-green-100 rounded transition-colors"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-green-600" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-700">{walletInfo.networkName}</span>
              {walletInfo.chainId !== 42161 && (
                <button
                  onClick={async () => {
                    await web3Service.switchToArbitrum();
                    handleRefresh();
                  }}
                  className="text-xs text-orange-600 hover:underline"
                >
                  Switch to Arbitrum
                </button>
              )}
            </div>
          </div>

          {/* Balances */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-600">Balances</h3>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {Object.entries(walletInfo.balances).map(([token, amount]) => (
              <div
                key={token}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{token}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 font-mono">{amount}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* MetaMask Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                alt="MetaMask"
                className="w-10 h-10"
              />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">Connect with MetaMask</p>
                <p className="text-xs text-blue-700">
                  Secure wallet connection via MetaMask browser extension. Your private keys never leave your device.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                <p className="text-xs text-red-800">{error}</p>
              </div>
              {error.includes('MetaMask is not installed') && (
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:underline mt-2 block"
                >
                  Download MetaMask →
                </a>
              )}
            </div>
          )}

          {/* Security Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ <strong>Security:</strong> This app uses MetaMask for secure wallet connection. We never have access to your private keys.
            </p>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                Connect MetaMask
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
