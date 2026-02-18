import React from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from '../lib/utils';
import { useVoice } from '../context/VoiceContext';

export const VoiceConfirmationDialog = ({ className }) => {
  const {
    pendingConfirmation,
    processCommand,
    cancelPendingConfirmation,
    isSpeaking
  } = useVoice();
  
  if (!pendingConfirmation) {
    return null;
  }
  
  const handleConfirm = () => {
    processCommand('yes');
  };
  
  const handleCancel = () => {
    cancelPendingConfirmation();
  };
  
  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
        className
      )}
      data-testid="voice-confirmation-dialog"
    >
      <Card className="w-full max-w-md mx-4 bg-gray-900 border-yellow-500/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-yellow-500/20">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white mb-2">
                Confirm Action
              </h3>
              <p className="text-gray-300 mb-4">
                {pendingConfirmation.prompt}
              </p>
              
              {pendingConfirmation.warnings?.length > 0 && (
                <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30">
                  <ul className="text-sm text-red-400 space-y-1">
                    {pendingConfirmation.warnings.map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="text-sm text-gray-400 mb-4">
                Say "yes" to confirm or "no" to cancel
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancel}
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleConfirm}
                >
                  <Check size={16} className="mr-2" />
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceConfirmationDialog;
