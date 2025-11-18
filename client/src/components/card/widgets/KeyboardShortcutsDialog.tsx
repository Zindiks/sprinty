import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'General',
    shortcuts: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close panel/dialog' },
    ],
  },
  {
    title: 'Card Actions',
    shortcuts: [
      { keys: ['T'], description: 'Edit title' },
      { keys: ['D'], description: 'Edit description' },
      { keys: ['A'], description: 'Add assignee' },
      { keys: ['L'], description: 'Add label' },
      { keys: ['C'], description: 'Add comment' },
      { keys: ['Del'], description: 'Delete card (with confirmation)' },
    ],
  },
  {
    title: 'Editing',
    shortcuts: [
      { keys: ['Enter'], description: 'Save changes (inline edit)' },
      { keys: ['Cmd', 'Enter'], description: 'Save comment/reply' },
      { keys: ['Esc'], description: 'Cancel editing' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['↑', '↓'], description: 'Navigate items (in lists)' },
      { keys: ['Tab'], description: 'Move to next field' },
      { keys: ['Shift', 'Tab'], description: 'Move to previous field' },
    ],
  },
];

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KeyboardShortcutsDialog = ({ open, onOpenChange }: KeyboardShortcutsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">{group.title}</h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 bg-muted rounded text-xs font-medium border border-border">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-muted-foreground text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">?</kbd> anytime to
            view these shortcuts
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Hook to manage keyboard shortcuts dialog
export const useKeyboardShortcuts = () => {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts dialog with ?
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Only trigger if not in an input/textarea
        const target = e.target as HTMLElement;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          setShowDialog(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { showDialog, setShowDialog };
};
