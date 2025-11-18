import { Keyboard } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export const KeyboardShortcutsHelp = () => {
  const shortcuts = [
    { keys: ['D', 'T'], description: 'Set due date to today 5PM' },
    { keys: ['D', 'N'], description: 'Set due date to tomorrow 5PM' },
    { keys: ['D', 'W'], description: 'Set due date to end of week' },
    { keys: ['D', 'M'], description: 'Set due date to end of month' },
    { keys: ['D', '3'], description: 'Set due date to 3 days from now' },
    { keys: ['D', 'X'], description: 'Clear due date' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Keyboard className="h-4 w-4" />
          Shortcuts
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm mb-2">Due Date Keyboard Shortcuts</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Press keys in sequence to quickly set due dates
            </p>
          </div>
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <div key={keyIndex} className="flex items-center">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                        {key}
                      </kbd>
                      {keyIndex < shortcut.keys.length - 1 && (
                        <span className="mx-1 text-muted-foreground">→</span>
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-3">{shortcut.description}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground italic">
              Note: Shortcuts work when not typing in input fields
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
