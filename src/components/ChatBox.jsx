import { useState, useRef, useEffect } from 'react';

const BOT_REPLIES = {
  default: "I'm not sure about that. Please contact us at info@yourdomain.com or call +2 392 3929 210.",
  keywords: [
    { match: ['hello', 'hi', 'hey', 'helo'], reply: "Hello! 👋 Welcome to Pacific Travel Agency. How can I help you today?" },
    { match: ['tour', 'tours', 'package', 'packages'], reply: "We offer amazing tour packages! 🌍 Check out our Destinations page for all available tours with prices and details." },
    { match: ['price', 'cost', 'how much', 'rate', 'pricing'], reply: "Our tour packages start from ₹66,499. Visit our Destinations page for detailed pricing on each tour." },
    { match: ['book', 'booking', 'reserve', 'reservation'], reply: "To book a tour, visit our Destinations page and click 'Book Now' on your preferred package. Need help? Call us at +2 392 3929 210." },
    { match: ['hotel', 'stay', 'accommodation', 'resort'], reply: "We partner with top-rated hotels worldwide! 🏨 Check our Hotel & Restaurant page for luxury stays and dining options." },
    { match: ['beach', 'sea', 'ocean', 'island'], reply: "Love the beach? 🏖️ We have amazing beach packages including Maldives, Bali, and Phuket. Visit our Beach experience page!" },
    { match: ['adventure', 'trek', 'hiking', 'mountain'], reply: "Feeling adventurous? 🏔️ We offer trekking, rafting, skydiving and more! Check out our Adventure experience page." },
    { match: ['camping', 'camp', 'outdoor', 'wilderness'], reply: "Love the outdoors? ⛺ Our camping packages include Sahara Desert, Rocky Mountains, and Patagonia. Check our Camping page!" },
    { match: ['nature', 'wildlife', 'safari', 'forest'], reply: "Nature lover? 🌿 We offer wildlife safaris, eco tours, and forest walks. Visit our Nature experience page!" },
    { match: ['party', 'festival', 'nightlife', 'club'], reply: "Party time! 🎉 We have Ibiza, Rio Carnival, and Bangkok nightlife packages. Check our Party experience page!" },
    { match: ['contact', 'call', 'phone', 'email', 'reach'], reply: "You can reach us at:\n📞 +2 392 3929 210\n📧 info@yourdomain.com\n📍 203 Fake St, San Francisco, CA" },
    { match: ['cancel', 'refund', 'money back'], reply: "For refund and cancellation policies, please visit our Refund Policy page or contact us directly." },
    { match: ['visa', 'passport', 'document'], reply: "We assist with travel documentation guidance. Please contact us directly for visa and passport requirements for your destination." },
    { match: ['thank', 'thanks', 'thankyou'], reply: "You're welcome! 😊 Is there anything else I can help you with?" },
    { match: ['bye', 'goodbye', 'see you'], reply: "Goodbye! 👋 Have a wonderful day. Feel free to chat anytime!" },
  ],
};

function getBotReply(input) {
  const lower = input.toLowerCase();
  for (const { match, reply } of BOT_REPLIES.keywords) {
    if (match.some(k => lower.includes(k))) return reply;
  }
  return BOT_REPLIES.default;
}

const INITIAL_MESSAGES = [
  { from: 'bot', text: "Hi there! 👋 I'm Pacific's virtual assistant. How can I help you today?" },
  { from: 'bot', text: "You can ask me about tours, hotels, bookings, pricing, or anything travel related!" },
];

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { from: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: getBotReply(trimmed) }]);
    }, 900);
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  const quickReplies = ['Tour Packages', 'Book a Tour', 'Pricing', 'Contact Us'];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Chat Window */}
      {open && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          style={{ height: '480px' }}>

          {/* Header */}
          <div className="bg-orange-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <i className="fa fa-commenting text-white text-sm" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">Pacific Support</p>
                <p className="text-orange-100 text-xs mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <i className="fa fa-times text-lg" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                    <i className="fa fa-commenting text-white text-xs" />
                  </div>
                )}
                <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.from === 'user'
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-700 shadow-sm rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <i className="fa fa-commenting text-white text-xs" />
                </div>
                <div className="bg-white shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 flex gap-2 overflow-x-auto flex-shrink-0 bg-white border-t border-gray-100">
            {quickReplies.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-xs text-orange-500 border border-orange-300 hover:bg-orange-500 hover:text-white px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex-shrink-0">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-3 py-3 flex gap-2 bg-white border-t border-gray-100 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all"
            />
            <button type="submit"
              className="w-9 h-9 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50"
              disabled={!input.trim()}>
              <i className="fa fa-paper-plane text-white text-sm" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ boxShadow: '0 0 0 0 rgba(249,115,22,0.6)', animation: !open ? 'pulse-ring 2s infinite' : 'none' }}
      >
        <i className={`fa ${open ? 'fa-times' : 'fa-commenting'} text-white text-xl transition-all`} />
      </button>
    </div>
  );
}
