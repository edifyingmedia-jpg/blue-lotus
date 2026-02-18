import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from './ui/dialog';
import { Shield, ExternalLink } from 'lucide-react';

const agreementLinks = [
  { label: 'Terms of Service', path: '/legal/terms' },
  { label: 'Privacy Policy', path: '/legal/privacy' },
];

const UserAgreementModal = ({ 
  isOpen, 
  onAccept, 
  onCancel,
  title = "User Agreement",
  body = "To continue using Blue Lotus, you must review and accept the Terms of Service and Privacy Policy."
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
      setIsChecked(false);
    }
  };

  const handleCancel = () => {
    setIsChecked(false);
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-white">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 text-sm leading-relaxed">
            {body}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Agreement Links */}
          <div className="space-y-2 mb-6">
            <p className="text-sm text-gray-400 mb-3">Please review our policies:</p>
            {agreementLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 bg-gray-800/50 hover:bg-blue-600/10 border border-gray-700 hover:border-blue-500/30 rounded-xl transition-all duration-200 group"
                data-testid={`agreement-link-${link.path.split('/').pop()}`}
              >
                <span className="text-gray-300 group-hover:text-white">
                  {link.label}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
              </Link>
            ))}
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
            <Checkbox
              id="agreement-checkbox"
              checked={isChecked}
              onCheckedChange={setIsChecked}
              className="mt-0.5 border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              data-testid="agreement-checkbox"
            />
            <label 
              htmlFor="agreement-checkbox" 
              className="text-sm text-gray-300 cursor-pointer leading-relaxed"
            >
              I have read and agree to the Terms of Service and Privacy Policy.
            </label>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            data-testid="agreement-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!isChecked}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="agreement-accept-btn"
          >
            Accept and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserAgreementModal;
