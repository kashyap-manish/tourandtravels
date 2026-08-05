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

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/923929210?text=Hi%20Pacific%20Travel%20Agency%2C%20I%20need%20help%20with%20a%20tour."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

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
