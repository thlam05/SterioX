import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send } from 'lucide-react';
import { type FormEvent } from 'react';
import type { StreamChatResponse } from '@/types/streamType';

interface ChatPanelProps {
  chats: StreamChatResponse[];
  streamUserId?: string;
  chatMessage: string;
  onChatMessageChange: (value: string) => void;
  onSendChat: (e: FormEvent) => void;
  placeholder?: string;
}

export function ChatPanel({
  chats,
  streamUserId,
  chatMessage,
  onChatMessageChange,
  onSendChat,
  placeholder = 'Gửi tin nhắn...',
}: ChatPanelProps) {
  return (
    <div className="bg-background border border-accent rounded-3xl flex flex-col h-[400px] overflow-hidden">
      <div className="p-4 border-b border-accent bg-background flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-black tracking-tight">
            Trò chuyện trực tiếp
          </h3>
        </div>
        <span className="text-[11px] font-bold bg-selection text-primary px-2 py-0.5 rounded-full">
          Kết nối tốt
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background">
        {chats.map((chat) => {
          const isStreamer = chat.user.id === streamUserId;
          const timeStr = new Date(chat.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          return (
            <div
              key={chat.id}
              className="text-xs leading-relaxed flex items-start gap-2"
            >
              <span className="text-secondary font-medium tracking-tighter shrink-0 pt-0.5">
                {timeStr}
              </span>
              <div>
                <span
                  className={`font-black mr-2 ${isStreamer ? 'text-primary bg-selection px-1.5 py-0.5 rounded-md text-[10px]' : 'text-foreground'}`}
                >
                  {chat.user.username}
                </span>
                <span className="text-secondary">{chat.content}</span>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={onSendChat}
        className="p-3 border-t border-accent bg-background flex gap-2"
      >
        <div className="flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={chatMessage}
            onChange={(e) => onChatMessageChange(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          className="px-4 py-2 rounded-xl flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
