import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import { Client, type StompSubscription } from '@stomp/stompjs';
import { useAuthStore } from '../stores/authStore';

interface SocketContextType {
  isConnected: boolean;
  sendMessage: (destination: string, payload: Record<string, unknown>) => void;
  subscribeTopic: <T>(
    topic: string,
    callback: (message: T) => void,
  ) => () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const stompClientRef = useRef<Client | null>(null);
  const pendingSubscriptionsRef = useRef<Array<() => void>>([]);

  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
        setIsConnected(false);
      }
      pendingSubscriptionsRef.current = [];
      return;
    }

    console.log('🔄 Đang kết nối Socket...');

    const client = new Client({
      brokerURL: import.meta.env.VITE_SOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    });

    client.onConnect = () => {
      console.log('🔌 Đã kết nối Socket!');
      setIsConnected(true);
      pendingSubscriptionsRef.current.forEach((subscribe) => subscribe());
      pendingSubscriptionsRef.current = [];
    };

    client.onDisconnect = () => {
      console.log('🔌 Đã ngắt kết nối Socket!');
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message']);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [isAuthenticated, token]);

  const sendMessage = (
    destination: string,
    payload: Record<string, unknown>,
  ) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination,
        body: JSON.stringify(payload),
      });
    } else {
      console.warn('Không thể gửi tin nhắn. Socket chưa kết nối!');
    }
  };

  const subscribeTopic = <T,>(
    topic: string,
    callback: (message: T) => void,
  ) => {
    if (!stompClientRef.current) return () => {};

    let subscription: StompSubscription | null = null;
    let cancelled = false;

    const subscribeNow = () => {
      if (
        !stompClientRef.current ||
        !stompClientRef.current.connected ||
        cancelled
      )
        return;
      subscription = stompClientRef.current.subscribe(topic, (message) => {
        callback(JSON.parse(message.body) as T);
      });
    };

    if (stompClientRef.current.connected) {
      subscribeNow();
    } else {
      pendingSubscriptionsRef.current.push(subscribeNow);
    }

    return () => {
      cancelled = true;
      if (subscription) {
        subscription.unsubscribe();
        console.log(`Đã hủy đăng ký kênh: ${topic}`);
      }
    };
  };

  return (
    <SocketContext.Provider
      value={{ isConnected, sendMessage, subscribeTopic }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext };
