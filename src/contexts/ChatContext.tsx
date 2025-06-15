import React, { createContext, useContext, useState } from 'react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  chatId: string;
}

interface Chat {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface ChatContextType {
  chats: Chat[];
  messages: Message[];
  sendMessage: (chatId: string, receiverId: string, content: string) => void;
  getMessagesForChat: (chatId: string) => Message[];
  createOrGetChat: (participantId: string, participantName: string) => string;
  markChatAsRead: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      participants: ['1', '2'],
      participantNames: ['You', 'Rahul Sharma'],
      lastMessage: 'When can you help with the assignment?',
      lastMessageTime: '2024-01-15T14:30:00Z',
      unreadCount: 2
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '2',
      receiverId: '1',
      content: 'Hi, I need help with my Data Structures assignment',
      timestamp: '2024-01-15T14:25:00Z',
      chatId: '1'
    },
    {
      id: '2',
      senderId: '1',
      receiverId: '2',
      content: 'Sure! I can help you with that. What specific topics do you need help with?',
      timestamp: '2024-01-15T14:27:00Z',
      chatId: '1'
    },
    {
      id: '3',
      senderId: '2',
      receiverId: '1',
      content: 'When can you help with the assignment?',
      timestamp: '2024-01-15T14:30:00Z',
      chatId: '1'
    }
  ]);

  const sendMessage = (chatId: string, receiverId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: '1', // Current user ID
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      chatId
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update the chat's last message
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: content,
          lastMessageTime: newMessage.timestamp
        };
      }
      return chat;
    }));
  };

  const getMessagesForChat = (chatId: string) => {
    return messages
      .filter(message => message.chatId === chatId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const createOrGetChat = (participantId: string, participantName: string): string => {
    const existingChat = chats.find(chat => 
      chat.participants.includes('1') && chat.participants.includes(participantId)
    );
    
    if (existingChat) {
      return existingChat.id;
    }
    
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      participants: ['1', participantId],
      participantNames: ['You', participantName],
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0
    };
    
    setChats(prev => [...prev, newChat]);
    return newChatId;
  };

  const markChatAsRead = (chatId: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, unreadCount: 0 };
      }
      return chat;
    }));
  };

  return (
    <ChatContext.Provider value={{
      chats,
      messages,
      sendMessage,
      getMessagesForChat,
      createOrGetChat,
      markChatAsRead
    }}>
      {children}
    </ChatContext.Provider>
  );
};