import React, { useState } from 'react';
import ChatList from '../components/ChatList';
import MessageView from '../components/MessageView';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  return (
    <div className="flex h-[100svh] w-full bg-white dark:bg-[#0d1117] overflow-hidden relative flex-col">
      <header className="text-center py-6 bg-gradient-to-b from-indigo-600 to-purple-600 shadow-lg rounded-b-2xl mb-4 text-white">
        <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">Subspace AI Chatbot </h1>
        <p className="mt-2 text-lg text-white/80 font-medium">Your smart assistant, always ready to help.</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              key="sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-full absolute top-0 left-0 z-40 md:relative md:z-auto"
            >
              <ChatList
                selectedChatId={selectedChatId}
                onSelectChat={(chatId) => {
                  setSelectedChatId(chatId);
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-30 md:hidden"></div>
        )}

        <main className="flex-1 h-full flex flex-col">
          <MessageView
            chatId={selectedChatId}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
