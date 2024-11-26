'use client'

import React, { useState } from 'react'
import { Bell, Moon, Sun, Lock, Globe } from 'lucide-react'

const ChatSettings = () => {
  const [notifications, setNotifications] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false);  
  const [privacy, setPrivacy] = useState('friends')
  const [language, setLanguage] = useState('en')

  const handleNotificationChange = () => setNotifications(!notifications)
  const handlePrivacyChange = (e) => setPrivacy(e.target.value)
  const handleLanguageChange = (e) => setLanguage(e.target.value)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark'); // Add dark class to <html>
    } else {
      document.documentElement.classList.remove('dark'); // Remove dark class from <html>
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-6  rounded-xl shadow-lg overflow-y-scroll scrollbar-hide h-[100%] ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}> 
         <h2 className="text-2xl font-bold mb-6 ">Chat Settings</h2>
      
      {/* Notifications */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2  ">Notifications</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-5 h-5   mr-2" />
            <span>Enable notifications</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications}
              onChange={handleNotificationChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 ">Light & Dark Mode</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-gray-900 dark:text-gray-300 mr-2" /> 
            ) : (
              <Sun className="w-5 h-5 text-gray-900 dark:text-gray-300 mr-2"  />
            )}
            {isDarkMode ? (
            <span >Dark mode</span>
          ) : (
            <span >Light mode</span>
            )}
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              
              onChange={toggleTheme}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Privacy */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 ">Privacy</h3>
        <div className="flex items-center">
          <Lock className="w-5 h-5  mr-2" />
          <select
            value={privacy}
            onChange={handlePrivacyChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="public">Public</option>
            <option value="friends">Friends only</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      {/* Language */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 ">Language</h3>
        <div className="flex items-center">
          <Globe className="w-5 h-5  mr-2" />
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
        Save Changes
      </button>
    </div>
  )
}

export default ChatSettings