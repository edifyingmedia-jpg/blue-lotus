import React from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useVoice } from '../context/VoiceContext';

export const ListeningIndicator = ({ className }) => {
  const { isListening, isSpeaking, isProcessing } = useVoice();
  
  if (!isListening && !isSpeaking && !isProcessing) {
    return null;
  }
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
        isListening && "bg-blue-500/20 text-blue-400",
        isSpeaking && "bg-green-500/20 text-green-400",
        isProcessing && "bg-yellow-500/20 text-yellow-400",
        className
      )}
      data-testid="listening-indicator"
    >
      {isListening && (
        <>
          <Mic size={14} className="animate-pulse" />
          <span>Listening...</span>
        </>
      )}
      {isSpeaking && (
        <>
          <Volume2 size={14} className="animate-pulse" />
          <span>Speaking...</span>
        </>
      )}
      {isProcessing && !isListening && (
        <>
          <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </>
      )}
    </div>
  );
};

export default ListeningIndicator;
