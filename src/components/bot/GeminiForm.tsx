"use client";
import CustomButton from '../CustomButton';
import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import TypingAnimation from './TypingAnimation';

type chatProps = {
  role: string;
  parts: string;
  image?: string;
}

const App = () => {
  const [value, setValue] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [chatHistory, setChatHistory] = useState<chatProps[]>([]);
  const [service, setService] = useState('');
  const [curUserInput, setCurUserInput] = useState<string>('');

  const endOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/service`);
      const data = await response.json().then(e => e.join(', '));
      setService(data);
    }

    fetchData();

    const text =
      `Hãy tự xưng mình là trợ lý TCH, 1 trợ lý ảo của The Clean House,
       1 phần mềm giúp đặt lịch dọn dẹp nhà của hãy trả lời câu hỏi của khách hàng,
       Khi khi được hỏi tch là gì thì hãy trả lời tôi là trợ lý của hệ thống cung cấp dịch vụ dọn dẹp nhà cửa, 
       Khi được hỏi có những dịch vụ gì, hãy trả lời chúng tôi cung cấp các dịch vụ như
       {Tổng vệ sinh, Dọn dẹp theo ca lẻ, Dọn dẹp văn phòng, Giặt ủi, Vệ sinh máy lạnh, Chăm sóc trẻ em, Diệt côn trùng, Vệ Sinh Sofa - Rèm - Thảm và Vệ sinh sân vườn},
       Nếu khách hàng hỏi thêm về các dịch vụ thì hãy giới thiệu khách hàng ấn vào phần "Dịch vụ" ở trên đầu trang để xem thêm chi tiết,
       Hãy đưa các dịch vụ của hệ thống phù hợp với nhu cầu của khách hàng,
       hãy giới thiệu cách đặt lịch dọn dẹp bằng cách ấn vào "Đặt lịch" ở trên đầu trang, 
       chỉ giới thiệu các dịch vụ có sẵn của hệ thống đã được cung cấp và không trả lời linh tinh,
       luôn luôn hướng khách hàng tới việc đặt dịch vụ của hệ thống,
       `

    if (chatHistory.length < 2) {
      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "Khách hàng",
        parts: text,
        image: '',

      },
      {
        role: "Trợ lý",
        parts: "",
        image: ''
      }
      ]);
    }
  }, [service]);

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const demoOptions: string[] = [
    ""
  ];

  const handleDemo = async (index: number) => {
    setValue(demoOptions[index]);
  }

  const getResponse = async () => {
    try {
      setIsPending(true);
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory.map(chat => ({ role: "user", parts: chat.parts })),
          message: curUserInput
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gemini`, options);
      const data = await response.text()
      // const data = 'trang';
      const text = `|${curUserInput}|`;

      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "Khách hàng",
        parts: text,
        image: '',

      },
      {
        role: "Trợ lý",
        parts: data,
        image: ''
      }
      ]);

      setIsPending(false);

    } catch (error) {
      console.error(error);
    }
  }

  const clear = () => {
    setValue("");
    setChatHistory([]);
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form from being submitted
      setValue("");
      getResponse();
    }
  }

  return (
    <div style={{ zIndex: 999 }}>
      <div className={cn("app bg-slate-100 rounded-2xl text-white border w-[400px] shadow-lg shadow-gray-400 ")}>
        <div>
          <div className='flex bg-white w-full p-4 items-center rounded-t-2xl '>
            <Image src={''} alt='logo' className="w-12 h-12 mr-1 rounded-full object-cover" />
            <div className=''>
              <p className='text-slate-700 font-semibold'>Trợ lý TCH</p>
              <div className='flex items-center'>
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className='text-slate-400 text-sm'>Đang hoạt động</p>
              </div>
            </div>
          </div>
        </div>
        <div className="search-result flex flex-col h-[470px] max-h-[470px] overflow-y-auto">
          {chatHistory.map((chatItem, _index) =>
            <div key={_index} className='w-full '>
              {
                (_index % 2 !== 0 && _index > 1) && (
                  <div className='flex w-full justify-start'>
                    <Image src={''} alt='logo' className="w-8 h-8 mr-1 mt-8 rounded-full object-cover" />
                    <div className=''>
                      <span className='text-gray-500 text-[10px] '>
                        {chatItem.role.charAt(0).toUpperCase() + chatItem.role.slice(1)}
                      </span>
                      <div className='px-4 py-2 bg-slate-400 max-w-[250px] rounded-lg  '>
                        <ReactMarkdown>{chatItem.parts}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )
              }
              {(_index % 2 === 0 && _index > 0) && (
                <div className='flex w-full justify-end'>
                  <div className=''>
                    <p className='text-gray-500 text-[10px] text-right'>
                      {chatItem.role.charAt(0).toUpperCase() + chatItem.role.slice(1)}
                    </p>
                    <div className='px-4 py-2 bg-crusta rounded-lg max-w-[250px]'>
                      <ReactMarkdown>{chatItem.parts.split('|')[1]}</ReactMarkdown>
                    </div>
                  </div>
                  <img src={chatItem.image} className="w-8 h-8 ml-1 mr-2 mt-6 rounded-full object-cover" />
                </div>
              )}
            </div>)}
          <div ref={endOfChatRef} />
        </div>
        {
          chatHistory.length === 0 &&
          (
            <div className='flex items-center ml-2'>
              {demoOptions.map((option, index) => (
                <div key={index}>
                  <button className=" mb-2 text-slate-600 mr-2 surprise p-2 mt-4 rounded-lg border border-crusta" onClick={() => handleDemo(index)} disabled={!chatHistory}>{option}</button>
                </div>
              ))}
            </div>
          )
        }
        {isPending &&
          <div className='ml-2'>
            <TypingAnimation />
          </div>
        }
        <div className="w-full flex items-center mt-2 mb-3 justify-between">
          <div className='w-10/12 mr-2 mx-2 bg-white p-2 rounded-lg'>
            <input required className='border-none h-full bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none w-full focus:ring-0  focus:ring-offset-0 z-20'
              value={value}
              placeholder="Gửi câu hỏi của bạn tại đây"
              onChange={(e) => { setValue(e.target.value); setCurUserInput(e.target.value) }}
              onKeyDown={handleKeyDown} />
          </div>
          <div className='mr-2'>
            <CustomButton text='Gửi' variant='shine' onClick={getResponse} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


