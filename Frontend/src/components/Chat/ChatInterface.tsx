import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GroqResponse {
  id: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
  }>;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'system',
    content: `You are Legal-Ease AI, a specialized legal assistant for the Legal-Ease court management system. 

STRICT GUIDELINES:
- ONLY provide assistance related to legal matters, court procedures, case management, and legal documentation
- Focus on Indian legal system, court procedures, case filing, legal rights, and judiciary processes
- Help with legal document drafting, case status inquiries, court scheduling, and legal terminology
- Provide guidance on e-filing procedures, meeting schedules, and court etiquette
- Explain legal concepts, rights, and procedures in simple terms

IMPORTANT RESTRICTIONS:
- DO NOT answer non-legal questions (personal advice, general knowledge, entertainment, etc.)
- DO NOT provide medical, financial, or technical advice unrelated to legal matters
- DO NOT engage in casual conversation or non-legal topics
- If asked non-legal questions, politely redirect: "I'm a legal assistant and can only help with legal matters. Please ask about court procedures, legal documents, case filing, or other legal topics."

RESPONSE STYLE:
- Be professional, accurate, and helpful
- Use clear, simple language for legal explanations
- Always include disclaimers that this is general information, not legal advice
- Suggest consulting with qualified lawyers for specific legal cases`
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Legal topic validation
    const legalKeywords = [
      'legal', 'court', 'case', 'law', 'judge', 'lawyer', 'attorney', 'litigation', 'filing', 'hearing', 'trial',
      'evidence', 'witness', 'document', 'contract', 'agreement', 'rights', 'procedure', 'section', 'act',
      'criminal', 'civil', 'family', 'property', 'constitutional', 'divorce', 'custody', 'bail', 'appeal',
      'jurisdiction', 'verdict', 'sentence', 'plea', 'defendant', 'plaintiff', 'prosecution', 'defense',
      'legal advice', 'legal help', 'what is law', 'how to file', 'court process', 'legal procedure'
    ];

    const inputLower = input.toLowerCase();
    const isLegalQuery = legalKeywords.some(keyword => inputLower.includes(keyword)) ||
                        inputLower.includes('legal') ||
                        inputLower.includes('court') ||
                        inputLower.includes('case') ||
                        inputLower.includes('law');

    // Check for non-legal topics
    const nonLegalKeywords = [
      'weather', 'sports', 'entertainment', 'cooking', 'recipe', 'music', 'movie', 'game', 'joke',
      'personal relationship', 'dating', 'fashion', 'travel', 'vacation', 'hobby', 'pet', 'animal',
      'technology programming', 'coding', 'software development', 'gaming', 'social media'
    ];

    const isNonLegalQuery = nonLegalKeywords.some(keyword => inputLower.includes(keyword));

    if (isNonLegalQuery || (!isLegalQuery && !inputLower.includes('help') && !inputLower.includes('?'))) {
      const restrictionMessage: Message = {
        role: 'assistant',
        content: "I'm Legal-Ease AI, specialized in legal assistance only. I can help you with:\n\n• Court procedures and case filing\n• Legal document preparation\n• Understanding legal rights and laws\n• E-filing processes\n• Court scheduling and meetings\n• Legal terminology explanations\n• Indian legal system guidance\n\nPlease ask me about legal matters!"
      };
      
      const userMessage: Message = {
        role: 'user',
        content: input.trim(),
      };

      setMessages((prev) => [...prev, userMessage, restrictionMessage]);
      setInput('');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    apiMessages.push({
      role: userMessage.role,
      content: userMessage.content
    });

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 0.9,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data: GroqResponse = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 w-[350px] h-[450px] bg-white rounded-lg shadow-lg flex flex-col dark:bg-gray-800 dark:text-white"
          >
            <div className="p-4 border-b flex justify-between items-center dark:border-gray-700">
              <h3 className="font-semibold text-lg">Legal Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.slice(1).map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg shadow-md ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg dark:bg-gray-700">
                    <span className="animate-pulse">...</span> Thinking...
                  </div>
                </div>
              )}
              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm dark:bg-red-900 dark:text-red-300">
                    {error}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about court procedures, legal documents, case filing, or laws..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className={`p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-[50px] h-[50px] bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-all duration-200"
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  );
}
