"use client";
import CustomButton from '../CustomButton';
import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import TypingAnimation from './TypingAnimation';
import { useUser } from '@clerk/nextjs';

type chatProps = {
  role: string;
  parts: string;
  image?: string;
};

const App = () => {
  const [value, setValue] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [chatHistory, setChatHistory] = useState<chatProps[]>([]);
  const [curUserInput, setCurUserInput] = useState<string>('');
  const _user = useUser();

  const initialPrompt = "Hành động như 1 nhà tư vấn thời trang, cậu có nhiệm vụ tư vấn cho khách hành xu hướng cũng như cách phối đồ, trang phục phù hợp với xu hướng thời trang. Lần đầu tiên, không nói gì hết hãy trả lời theo câu sau: 'Xin chào, tôi là Trợ lý của Suburbia', sau đó hãy tư vấn cho khách hàng"

  const endOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  useEffect(() => {
    const sendInitPrompt = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gemini`, {
          method: 'POST',
          body: JSON.stringify({
            history: [{ role: "model", parts: initialPrompt }],
            message: initialPrompt
          }),
          headers: { 'Content-Type': 'application/json' }
        });
  
        const data = await response.text();
  
        setChatHistory([
          { role: "user", parts: initialPrompt, image: _user?.user?.imageUrl || 'default-user.png' }, // Add user input
          { role: "model", parts: data, image: '/bot-icon.png' } // Add bot response
        ]);
      } catch (error) {
        console.error("Error sending init prompt:", error);
      }
    };
  
    sendInitPrompt();
  }, []);
  

  const getResponse = async () => {
    if (!curUserInput.trim()) return;
    try {
      setIsPending(true);
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory.map(chat => ({
            role: chat.role === "Trợ lý" ? "model" : "user",  // ✅ Fix here
            parts: chat.parts
          })),
          message: curUserInput
        }),
        headers: { 'Content-Type': 'application/json' }
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gemini`, options);
      const data = await response.text();
  
      setChatHistory(oldChatHistory => [
        ...oldChatHistory,
        {
          role: "user",  // ✅ Change from "Khách hàng" to "user"
          parts: curUserInput,
          image: _user.isSignedIn
            ? _user?.user?.imageUrl
            : 'https://lh3.googleusercontent.com/a/ACg8ocJDmFpEIhiMJ2AyrekxxUD1YMj2Hs9Nj4_xh3ZiWalgeg=s96-c',
        },
        { role: "model", parts: data, image: '/bot-icon.png' } // ✅ Change from "Trợ lý" to "model"
      ]);
  
      setValue("");
      setCurUserInput("");
      setIsPending(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      getResponse();
    }
  };

  return (
    <div style={{ zIndex: 999 }}>
    <div className={cn("app bg-slate-100 rounded-2xl text-white border w-[400px] shadow-lg shadow-gray-400 ")}>
      <div className="search-result flex flex-col h-[470px] max-h-[470px] overflow-y-auto">
        {chatHistory.slice(1).map((chatItem, _index) => (
          <div key={_index} className='w-full '>
            <div className={`flex w-full ${chatItem.role === "model" ? "justify-start" : "justify-end"}`}>
              {chatItem.role === "model" && <img src={'/bot-icon.png'} alt='logo' className="w-8 h-8 mr-1 mt-8 rounded-full object-cover" />}
              <div>
                <span className='text-gray-500 text-[10px] '>
                  {chatItem.role.charAt(0).toUpperCase() + chatItem.role.slice(1)}
                </span>
                <div className={`px-4 py-2 ${chatItem.role === "model" ? "bg-slate-400" : "bg-blue-500"} max-w-[250px] rounded-lg text-white`}> 
                  <ReactMarkdown>{chatItem.parts}</ReactMarkdown>
                </div>
              </div>
              {chatItem.role !== "model" && <img src={chatItem.image} className="w-8 h-8 ml-1 mr-2 mt-6 rounded-full object-cover" />}
            </div>
          </div>
        ))}
        <div ref={endOfChatRef} />
      </div>
      {isPending && <div className='ml-2'><TypingAnimation /></div>}
      <div className="w-full flex items-center mt-2 mb-3 justify-between">
        <div className='w-10/12 mr-2 mx-2 bg-white p-2 rounded-lg'>
          <input required className='border-none h-full bg-transparent text-slate-800 focus:outline-none w-full focus:ring-0' 
            value={value}
            placeholder="Gửi câu hỏi của bạn tại đây"
            onChange={(e) => { setValue(e.target.value); setCurUserInput(e.target.value); }}
            onKeyDown={handleKeyDown} />
        </div>
        <div className='mr-2'>
          <CustomButton text='Gửi' variant='shine' onClick={getResponse} />
        </div>
      </div>
    </div>
  </div>  
  );
};

export default App;
