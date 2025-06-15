import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ItemProvider } from './contexts/ItemContext';
import { ChatProvider } from './contexts/ChatContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddItem from './pages/AddItem';
import ItemDetails from './pages/ItemDetails';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Payment from './pages/Payment';

function App() {
  return (
    <AuthProvider>
      <ItemProvider>
        <ChatProvider>
          <Router>
            <div className="min-h-screen bg-gray-900 text-white">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/add-item" element={<AddItem />} />
                  <Route path="/item/:id" element={<ItemDetails />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/payment" element={<Payment />} />
                </Routes>
              </main>
            </div>
          </Router>
        </ChatProvider>
      </ItemProvider>
    </AuthProvider>
  );
}

export default App;