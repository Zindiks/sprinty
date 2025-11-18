import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useTemplates } from '@/hooks/useTemplates';
import { useStore } from '@/hooks/store/useStore';

interface SaveAsTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
}

const EMOJI_OPTIONS = ['📋', '🏃', '✅', '🐛', '📝', '🚀', '⭐', '🎯', '💡', '🔥'];

export function SaveAsTemplateDialog({ open, onOpenChange, boardId }: SaveAsTemplateDialogProps) {
  const { organization_id } = useStore();
  const { createTemplateFromBoard } = useTemplates(organization_id);

  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📋');
  const [includeCards, setIncludeCards] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTemplateFromBoard.mutateAsync({
        board_id: boardId,
        template_name: templateName,
        description: description || undefined,
        category: 'custom',
        icon: selectedIcon,
        include_cards_as_examples: includeCards,
      });

      // Reset form and close
      resetForm();
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hook with toast
      console.error('Failed to save board as template:', error);
    }
  };

  const resetForm = () => {
    setTemplateName('');
    setDescription('');
    setSelectedIcon('📋');
    setIncludeCards(false);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            Create a reusable template from this board that you can use to quickly set up new
            boards.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Marketing Campaign Workflow"
              required
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">{templateName.length}/50 characters</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="template-description">Description (optional)</Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is for..."
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{description.length}/200 characters</p>
          </div>

          {/* Icon Selector */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedIcon(emoji)}
                  className={`text-2xl w-12 h-12 rounded-md border-2 transition-all hover:scale-110 ${
                    selectedIcon === emoji
                      ? 'border-primary bg-primary/10 scale-110'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  aria-label={`Select ${emoji} icon`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Include Cards Checkbox */}
          <div className="flex items-start space-x-2 border rounded-lg p-3 bg-muted/50">
            <Checkbox
              id="include-cards"
              checked={includeCards}
              onCheckedChange={(checked) => setIncludeCards(checked as boolean)}
            />
            <div className="space-y-1">
              <Label htmlFor="include-cards" className="text-sm font-medium cursor-pointer">
                Include cards as example cards
              </Label>
              <p className="text-xs text-muted-foreground">
                Existing cards will be saved as example cards in the template. When creating a board
                from this template, users can choose whether to include these examples.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={createTemplateFromBoard.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!templateName.trim() || createTemplateFromBoard.isPending}
            >
              {createTemplateFromBoard.isPending ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
