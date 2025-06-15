import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, User } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { chats, sendMessage, getMessagesForChat, markChatAsRead } = useChat();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(chats[0]?.id || null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChatId]);

  useEffect(() => {
    if (selectedChatId) {
      markChatAsRead(selectedChatId);
      scrollToBottom();
    }
  }, [selectedChatId, markChatAsRead]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please log in to access chat.</p>
      </div>
    );
  }

  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  const chatMessages = selectedChatId ? getMessagesForChat(selectedChatId) : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const receiverId = selectedChat.participants.find(id => id !== user.id);
    if (receiverId && selectedChatId) {
      sendMessage(selectedChatId, receiverId, newMessage);
      setNewMessage('');
      // Scroll to bottom after sending message
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    markChatAsRead(chatId);
  };

  const filteredChats = chats.filter(chat =>
    chat.participantNames.some(name =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className="w-1/3 border-r border-gray-700 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`w-full p-4 text-left border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                  selectedChatId === chat.id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-600 p-2 rounded-full">
                    <User className="h-5 w-5 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium truncate">
                        {chat.participantNames.find(name => name !== 'You')}
                      </h3>
                      {chat.unreadCount > 0 && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full ml-2">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm truncate">{chat.lastMessage || 'No messages yet'}</p>
                    <p className="text-gray-500 text-xs">
                      {formatTime(chat.lastMessageTime)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400">
              No conversations found
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-750">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-600 p-2 rounded-full">
                  <User className="h-5 w-5 text-gray-300" />
                </div>
                <div>
                  <h2 className="text-white font-medium">
                    {selectedChat.participantNames.find(name => name !== 'You')}
                  </h2>
                  <p className="text-gray-400 text-sm">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length > 0 ? (
                chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <p className="break-words">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === user.id ? 'text-green-100' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="bg-gray-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Start a conversation</h3>
                    <p className="text-gray-400">Send a message to begin chatting</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gray-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;