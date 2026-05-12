import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, Trash2, ExternalLink } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onClearApiKey: () => void;
}

export function SettingsDialog({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  onClearApiKey,
}: SettingsDialogProps) {
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    onSaveApiKey(inputValue.trim());
    onClose();
  };

  const handleClear = () => {
    setInputValue('');
    onClearApiKey();
  };

  const maskedKey = apiKey 
    ? `${apiKey.slice(0, 12)}...${apiKey.slice(-4)}`
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            API Settings
          </DialogTitle>
          <DialogDescription>
            Connect to OpenRouter for real AI-powered responses. Your key is stored locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenRouter API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                placeholder="sk-or-v1-..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {apiKey && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Current key:</p>
              <p className="text-sm font-mono">{maskedKey}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="w-3 h-3" />
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary underline"
            >
              Get your free API key from OpenRouter
            </a>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          {apiKey && (
            <Button variant="outline" onClick={handleClear} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
          <Button onClick={handleSave} disabled={!inputValue.trim()}>
            Save Key
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
