// Type definitions for MusicRewards app

export interface MusicChallenge {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  points: number;
  audioUrl: string;
  completed: boolean;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export interface UseMusicPlayerReturn {
  isPlaying: boolean;
  currentTrack: MusicChallenge | null;
  currentPosition: number;
  duration: number;
  play: (track: MusicChallenge) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  seekTo: (seconds: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface PointsCounterConfig {
  pointsPerSecond: number;
  maxPoints: number;
  challengeId: string;
}

export interface UsePointsCounterReturn {
  currentPoints: number;
  pointsEarned: number;
  progress: number; // 0-100
  isActive: boolean;
  startCounting: (config: PointsCounterConfig) => void;
  stopCounting: () => void;
  resetProgress: () => void;
  updateProgress: (position: number, duration: number) => void;
}

export interface GlassCardProps {
  children: React.ReactNode;
  blurIntensity?: number;
  borderRadius?: number;
  style?: any;
  gradientColors?: readonly string[];
}

export interface GlassButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface ChallengeCardProps {
  challenge: MusicChallenge;
  onPlay: (challenge: MusicChallenge) => void;
  progress?: number;
}

export interface AudioVisualizerProps {
  isPlaying: boolean;
  bars?: number;
  color?: string;
}

export interface ConfettiAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  colors?: string[];
}

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onHide?: () => void;
}

export interface UseToastReturn {
  showToast: (message: string, type?: ToastProps['type']) => void;
  hideToast: () => void;
  toast: ToastProps | null;
}

export interface UseNetworkStatusReturn {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string | null;
}

export interface UseOptimisticUpdatesReturn {
  optimisticUpdate: <T>(
    key: string,
    updateFn: (current: T) => T,
    rollbackFn: () => Promise<void>
  ) => Promise<void>;
  isUpdating: (key: string) => boolean;
}
