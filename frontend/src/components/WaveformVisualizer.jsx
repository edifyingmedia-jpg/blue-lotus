import React from 'react';
import { cn } from '../lib/utils';
import { useVoice } from '../context/VoiceContext';

export const WaveformVisualizer = ({ 
  className,
  barCount = 20,
  height = 40 
}) => {
  const { isListening, audioLevel } = useVoice();
  
  if (!isListening) {
    return null;
  }
  
  // Generate bar heights based on audio level
  const bars = Array.from({ length: barCount }, (_, i) => {
    const position = i / barCount;
    const centerDistance = Math.abs(0.5 - position);
    const baseHeight = 0.2 + (1 - centerDistance) * 0.8;
    const variation = Math.sin(Date.now() / 100 + i) * 0.3;
    const normalizedLevel = baseHeight * audioLevel + variation * audioLevel;
    return Math.max(0.1, Math.min(1, normalizedLevel));
  });
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center gap-[2px]",
        className
      )}
      style={{ height }}
      data-testid="waveform-visualizer"
    >
      {bars.map((barHeight, i) => (
        <div
          key={i}
          className="bg-blue-400 rounded-full transition-all duration-75"
          style={{
            width: 3,
            height: `${barHeight * height}px`,
            opacity: 0.5 + barHeight * 0.5
          }}
        />
      ))}
    </div>
  );
};

export default WaveformVisualizer;
