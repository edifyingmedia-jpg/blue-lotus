import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { useVoice } from '../context/VoiceContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const VoiceModeToggle = ({ className }) => {
  const {
    settings,
    updateSettings,
    toggleVoiceMode,
    isVoiceInputEnabled,
    isVoiceOutputEnabled
  } = useVoice();
  
  const getIcon = () => {
    if (!isVoiceInputEnabled && !isVoiceOutputEnabled) {
      return <MicOff size={18} />;
    }
    if (isVoiceInputEnabled && isVoiceOutputEnabled) {
      return <Mic size={18} />;
    }
    if (isVoiceInputEnabled) {
      return <Mic size={18} />;
    }
    return <Volume2 size={18} />;
  };
  
  const getModeLabel = () => {
    switch (settings.voice_mode) {
      case 'voice_on': return 'Voice On';
      case 'voice_off': return 'Voice Off';
      case 'voice_input_only': return 'Input Only';
      case 'voice_output_only': return 'Output Only';
      default: return 'Voice';
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-2",
            isVoiceInputEnabled || isVoiceOutputEnabled 
              ? "text-blue-400" 
              : "text-gray-500",
            className
          )}
          data-testid="voice-mode-toggle"
        >
          {getIcon()}
          <span className="hidden sm:inline">{getModeLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Voice Mode</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => updateSettings({ voice_mode: 'voice_on' })}
          className={settings.voice_mode === 'voice_on' ? 'bg-blue-500/20' : ''}
        >
          <Mic size={16} className="mr-2" />
          Voice On
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateSettings({ voice_mode: 'voice_off' })}
          className={settings.voice_mode === 'voice_off' ? 'bg-blue-500/20' : ''}
        >
          <MicOff size={16} className="mr-2" />
          Voice Off
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateSettings({ voice_mode: 'voice_input_only' })}
          className={settings.voice_mode === 'voice_input_only' ? 'bg-blue-500/20' : ''}
        >
          <Mic size={16} className="mr-2" />
          Input Only
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updateSettings({ voice_mode: 'voice_output_only' })}
          className={settings.voice_mode === 'voice_output_only' ? 'bg-blue-500/20' : ''}
        >
          <Volume2 size={16} className="mr-2" />
          Output Only
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VoiceModeToggle;
