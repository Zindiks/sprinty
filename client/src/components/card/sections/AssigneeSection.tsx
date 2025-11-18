import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, X, Plus } from 'lucide-react';
import { useAssignees } from '@/hooks/useAssignees';
import { AssigneeSelector } from '../widgets/AssigneeSelector';

interface AssigneeSectionProps {
  cardId: string;
}

export const AssigneeSection = ({ cardId }: AssigneeSectionProps) => {
  const { assignees, isLoading, removeAssignee } = useAssignees(cardId);
  const [showSelector, setShowSelector] = useState(false);

  const getInitials = (username?: string, email?: string) => {
    if (username) {
      return username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleRemoveAssignee = (userId: string) => {
    removeAssignee.mutate({ card_id: cardId, user_id: userId });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Users className="w-4 h-4" />
          Assignees
          {assignees && assignees.length > 0 && (
            <span className="text-xs text-muted-foreground">({assignees.length})</span>
          )}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSelector(true)}
          className="h-7 gap-1"
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      {isLoading ? (
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        </div>
      ) : assignees && assignees.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {assignees.map((assignee) => (
            <TooltipProvider key={assignee.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="group relative">
                    <Avatar className="w-8 h-8 border-2 border-background ring-1 ring-border">
                      {assignee.user.avatar_url && (
                        <AvatarImage
                          src={assignee.user.avatar_url}
                          alt={assignee.user.username || assignee.user.email}
                        />
                      )}
                      <AvatarFallback className="text-xs">
                        {getInitials(assignee.user.username, assignee.user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => handleRemoveAssignee(assignee.user_id)}
                      disabled={removeAssignee.isPending}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{assignee.user.username || assignee.user.email}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">No assignees yet</p>
      )}

      <AssigneeSelector
        cardId={cardId}
        open={showSelector}
        onClose={() => setShowSelector(false)}
        currentAssignees={assignees?.map((a) => a.user_id) || []}
      />
    </div>
  );
};
