import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CHATS_QUERY } from '../graphql/queries';
import {
  CREATE_CHAT_MUTATION,
  UPDATE_CHAT_TITLE_MUTATION,
  DELETE_CHAT_MUTATION,
} from '../graphql/mutations';
import { useSignOut, useUserData } from '@nhost/react';
import { Loader2, PlusCircle, MoreHorizontal, LogOut, Trash2, Pencil } from 'lucide-react';
import clsx from 'clsx';
import { Toaster, toast } from 'react-hot-toast';
import { Menu } from '@headlessui/react';
import { motion } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';
import Avatar from './Avatar';


const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-indigo-400 text-white hover:from-indigo-500 hover:to-pink-400 transition"
    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
};


const ChatList = ({ selectedChatId, onSelectChat }) => {
  const { data, loading, error } = useQuery(GET_CHATS_QUERY);
  const userData = useUserData();
  const { signOut } = useSignOut();
  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [chatToDelete, setChatToDelete] = useState(null);


  const [createChat, { loading: creatingChat }] = useMutation(CREATE_CHAT_MUTATION, {
    refetchQueries: [{ query: GET_CHATS_QUERY }],
    onCompleted: (data) => {
      onSelectChat(data.insert_chats_one.id);
      toast.success('New chat created!');
    },
    onError: (err) => toast.error(`Error creating chat: ${err.message}`),
  });


  const [updateChatTitle] = useMutation(UPDATE_CHAT_TITLE_MUTATION, {
    onError: (err) => toast.error(`Error renaming chat: ${err.message}`),
  });


  const [deleteChat] = useMutation(DELETE_CHAT_MUTATION, {
    update(cache, { data: { delete_chats_by_pk } }) {
      cache.modify({
        fields: {
          chats(existingChats = [], { readField }) {
            return existingChats.filter((chatRef) => delete_chats_by_pk.id !== readField('id', chatRef));
          },
        },
      });
    },
    onCompleted: () => {
      if (selectedChatId === chatToDelete?.id) {
        onSelectChat(null);
      }
      toast.success('Chat deleted!');
      setChatToDelete(null);
    },
    onError: (err) => toast.error(`Error deleting chat: ${err.message}`),
  });


  const handleNewChat = () => {
    const newChatTitle = `Chat - ${new Date().toLocaleTimeString()}`;
    createChat({ variables: { title: newChatTitle } });
  };


  const handleStartEditing = (chat) => {
    setEditingChatId(chat.id);
    setNewTitle(chat.title);
  };


  const handleTitleSubmit = (chatId) => {
    if (newTitle.trim()) {
      updateChatTitle({ variables: { id: chatId, title: newTitle } });
    }
    setEditingChatId(null);
  };


  const handleDeleteConfirm = () => {
    if (chatToDelete) {
      deleteChat({ variables: { id: chatToDelete.id } });
    }
  };


  if (loading) return <div className="p-6 text-center text-white">Loading chats...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error loading chats</div>;


  return (
    <div className="h-full w-72 px-4 py-6 bg-gradient-to-b from-purple-700 via-indigo-700 to-indigo-900 rounded-tr-3xl rounded-br-lg shadow-2xl flex flex-col gap-4">
      <Toaster />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-bold">Chats</h2>
        <button
          onClick={handleNewChat}
          disabled={creatingChat}
          className="text-white focus:outline-none hover:text-pink-300 transition"
          title="Start New Chat"
        >
          <PlusCircle size={24} />
        </button>
      </div>


      <div className="flex-1 overflow-y-auto no-scrollbar">
        {data.chats.length === 0 ? (
          <p className="text-white p-4">No chats found. Start a new chat!</p>
        ) : (
          data.chats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              layout
            >
              {editingChatId === chat.id ? (
                <input
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => handleTitleSubmit(chat.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSubmit(chat.id);
                  }}
                  className="w-full px-2 py-1 rounded-md text-black"
                />
              ) : (
                <div
                  onClick={() => onSelectChat(chat.id)}
                  className={clsx(
                    "cursor-pointer px-4 py-2 rounded-lg flex justify-between items-center text-white",
                    selectedChatId === chat.id ? 'bg-indigo-600' : 'hover:bg-indigo-500/50'
                  )}
                >
                  <span className="truncate">{chat.title}</span>
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="p-1 hover:text-pink-300">
                      <MoreHorizontal size={16} />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg focus:outline-none z-50">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleStartEditing(chat)}
                            className={`${
                              active ? 'bg-indigo-100' : ''
                            } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Rename
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setChatToDelete(chat)}
                            className={`${
                              active ? 'bg-red-100' : ''
                            } group flex w-full items-center px-4 py-2 text-sm text-red-600`}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>


      {/* Theme toggle and Sign out */}
      <div className="mt-auto flex justify-between items-center pt-4 border-t border-indigo-800">
        <ThemeToggle />
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 font-bold"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>


      {/* Confirmation Modal for Deletion */}
      {chatToDelete && (
        <ConfirmationModal
          isOpen={!!chatToDelete}
          onClose={() => setChatToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Confirm Delete"
        >
          Are you sure you want to delete "{chatToDelete.title}"? This action cannot be undone.
        </ConfirmationModal>
      )}
    </div>
  );
};


export default ChatList;
