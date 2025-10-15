// Network status hook for offline-first architecture
import { useState, useEffect } from 'react';
import * as Network from 'expo-network';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: 'unknown',
  });

  useEffect(() => {
    const checkNetworkStatus = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setNetworkStatus({
        isConnected: networkState.isConnected ?? false,
        isInternetReachable: networkState.isInternetReachable ?? false,
        type: networkState.type,
      });
    };

    checkNetworkStatus();
    
    // Check network status periodically
    const interval = setInterval(checkNetworkStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return networkStatus;
};
