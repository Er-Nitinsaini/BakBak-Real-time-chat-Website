import React, { useState } from 'react';

function AnonomousHackChat() {
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // State to track checkbox

  const handleStartChat = () => {
    setIsLoading(true); // Show loader
    setTimeout(() => {
      setShowChat(true); // Show chat interface after delay
      setIsLoading(false); // Hide loader
    }, 3000); // Simulate loading time (3 seconds)
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle checkbox state
  };

  return (
    <>
      {!showChat ? (
        <>
          <div className='flex justify-center text-red-600 text-5xl max-sm:text-[1.1rem]'>
            <h1>BaKBak-Anonymous!HackChat</h1>
          </div>
          <div className='pt-20 ml-20 max-sm:ml-0 max-sm:pt-2'>
            <h1 className='text-2xl text-green-300 max-sm:text-[10px]'>Instruction :</h1>
            <div>
            <ol
  className="list-disc pl-5 text-xl max-sm:text-[9px]"
  style={{ listStyleType: "decimal", color: "yellow" }}
>
  <li>Your conversations are completely private—Anonymous Hack Chat does not store any messages.</li>
  <li>Click the "Start Chat" button to begin. Please wait a few seconds for the chat environment to load.</li>
  <li>Once loaded, enter your anonymous name and click the "Infiltrate" button to proceed.</li>
  <li>Welcome to your chat environment! You're now ready to connect and chat anonymously.</li>
  <li>You will see two options:
    <ul className="pl-5" style={{ listStyleType: "circle" }}>
      <li>"Create Channel" - Start a new chat room and generate a unique Room ID.</li>
      <li>"Enter Room ID" - Join an existing room using a Room ID shared by your friends.</li>
    </ul>
  </li>
  <li>If you create a channel, share the generated Room ID with your friends to let them join your chat room.</li>
  <li>Enjoy secure, real-time chatting with your friends or anyone else anonymously!</li>
</ol>

            </div>
          </div>

          <div className="flex items-center justify-center mt-8">
            <input
              type="checkbox"
              id="instructionsCheckbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="instructionsCheckbox" className="text-yellow-400 text-xl">
              I have read the instructions
            </label>
          </div>

          <div className='flex justify-center mt-8 max-sm:mt-5'>
            <button
              className={`bg-red-600 w-48 h-10 text-black rounded-2xl ${
                isChecked ? 'hover:bg-yellow-400' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={handleStartChat}
              disabled={!isChecked} // Disable button if checkbox not checked
            >
              Start Chat
            </button>
          </div>

          {isLoading && (
            <div className="flex justify-center mt-5">
              <div className="loader border-t-4 border-b-4 border-yellow-400 rounded-full w-12 h-12 animate-spin"></div>
            </div>
          )}
        </>
      ) : (
        <div className='flex justify-center items-center h-screen'>
          <iframe
            src="https://hack-chat.onrender.com/"
            title="Anonymous Hack Chat"
            className="w-full h-full border-0"
          />
        </div>
      )}
    </>
  );
}

export default AnonomousHackChat;
