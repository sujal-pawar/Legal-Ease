import React from 'react';
import { FileText, Gavel, Users, Clock, HelpCircle, Scale } from 'lucide-react';

interface LegalTopicSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function LegalTopicSuggestions({ onSuggestionClick }: LegalTopicSuggestionsProps) {
  const suggestions = [
    {
      icon: FileText,
      title: "E-Filing Process",
      question: "How do I file a case online through e-filing?",
      category: "Filing"
    },
    {
      icon: Gavel,
      title: "Court Procedures",
      question: "What are the steps in a civil court procedure?",
      category: "Procedures"
    },
    {
      icon: Users,
      title: "Legal Rights",
      question: "What are my fundamental legal rights in India?",
      category: "Rights"
    },
    {
      icon: Clock,
      title: "Case Timeline",
      question: "How long does a typical civil case take to resolve?",
      category: "Timeline"
    },
    {
      icon: Scale,
      title: "Legal Documents",
      question: "What documents are required for filing a property dispute?",
      category: "Documents"
    },
    {
      icon: HelpCircle,
      title: "Court Fees",
      question: "How are court fees calculated for different types of cases?",
      category: "Fees"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
        💡 Ask me about legal topics:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.question)}
              className="flex items-center p-3 text-left hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
            >
              <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                  {suggestion.title}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {suggestion.question}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-800 dark:text-yellow-200">
        <strong>Reminder:</strong> I only provide general legal information. For specific legal advice, consult a qualified lawyer.
      </div>
    </div>
  );
}