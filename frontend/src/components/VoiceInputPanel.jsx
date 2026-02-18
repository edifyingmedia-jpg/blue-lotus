import React from 'react';
import { MicrophoneButton } from './MicrophoneButton';
import { WaveformVisualizer } from './WaveformVisualizer';
import { ListeningIndicator } from './ListeningIndicator';
import { VoiceModeToggle } from './VoiceModeToggle';
import { VoiceConfirmationDialog } from './VoiceConfirmationDialog';
import { useVoice } from '../context/VoiceContext';
import { cn } from '../lib/utils';

export const VoiceInputPanel = ({ 
  className,
  onCommandProcessed,
  showSettings = true 
}) => {
  const {
    isListening,
    isProcessing,
    transcription,
    lastResponse,
    error,
    settings
  } = useVoice();
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Voice mode toggle */}
      {showSettings && (
        <div className="mb-4">
          <VoiceModeToggle />
        </div>
      )}
      
      {/* Main controls */}
      <div className="flex flex-col items-center gap-4">
        {/* Waveform */}
        {isListening && (
          <WaveformVisualizer height={50} barCount={30} />
        )}
        
        {/* Microphone button */}
        <MicrophoneButton 
          size="lg" 
          showLabel 
          onCommandProcessed={onCommandProcessed}
        />
        
        {/* Status indicator */}
        <ListeningIndicator />
      </div>
      
      {/* Transcription display */}
      {settings.show_transcription && transcription && (
        <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700 max-w-md w-full">
          <p className="text-sm text-gray-400 mb-1">You said:</p>
          <p className="text-white">{transcription}</p>
        </div>
      )}
      
      {/* Response display */}
      {lastResponse?.response_text && !isListening && !isProcessing && (
        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 max-w-md w-full">
          <p className="text-sm text-blue-400 mb-1">Response:</p>
          <p className="text-white">{lastResponse.response_text}</p>
          {lastResponse.credits_used > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Credits used: {lastResponse.credits_used} | Remaining: {lastResponse.credits_remaining}
            </p>
          )}
        </div>
      )}
      
      {/* Error display */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 max-w-md w-full">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      
      {/* Confirmation dialog */}
      <VoiceConfirmationDialog />
    </div>
  );
};

export default VoiceInputPanel;
