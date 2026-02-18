import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useVoice } from '../context/VoiceContext';
import { cn } from '../lib/utils';

export const MicrophoneButton = ({ 
  className, 
  size = 'default',
  showLabel = false,
  onCommandProcessed 
}) => {
  const {
    isListening,
    isProcessing,
    isVoiceInputEnabled,
    startListening,
    stopListening,
    audioLevel,
    settings
  } = useVoice();
  
  const handleClick = async () => {
    if (isProcessing) return;
    
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };
  
  const handleMouseDown = () => {
    if (settings.input_mode === 'hold_to_record' && !isListening) {
      startListening();
    }
  };
  
  const handleMouseUp = () => {
    if (settings.input_mode === 'hold_to_record' && isListening) {
      stopListening();
    }
  };
  
  if (!isVoiceInputEnabled) {
    return null;
  }
  
  const buttonSize = {
    default: 'h-10 w-10',
    lg: 'h-14 w-14',
    sm: 'h-8 w-8'
  }[size];
  
  const iconSize = {
    default: 20,
    lg: 28,
    sm: 16
  }[size];
  
  return (
    <div className={cn("relative inline-flex flex-col items-center gap-2", className)}>
      {/* Pulse animation when listening */}
      {isListening && (
        <div 
          className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-25"
          style={{ transform: `scale(${1 + audioLevel * 0.5})` }}
        />
      )}
      
      <Button
        variant={isListening ? "default" : "outline"}
        size="icon"
        className={cn(
          buttonSize,
          "rounded-full relative z-10 transition-all duration-200",
          isListening && "bg-blue-500 hover:bg-blue-600 border-blue-500",
          isProcessing && "opacity-70 cursor-wait"
        )}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        disabled={isProcessing}
        data-testid="microphone-button"
      >
        {isProcessing ? (
          <Loader2 size={iconSize} className="animate-spin" />
        ) : isListening ? (
          <Mic size={iconSize} className="text-white" />
        ) : (
          <MicOff size={iconSize} />
        )}
      </Button>
      
      {showLabel && (
        <span className="text-xs text-gray-400">
          {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Click to speak'}
        </span>
      )}
    </div>
  );
};

export default MicrophoneButton;
