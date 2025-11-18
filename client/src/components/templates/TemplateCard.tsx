import { Template } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  selected?: boolean;
}

export function TemplateCard({ template, onSelect, selected = false }: TemplateCardProps) {
  const listCount = template.structure.lists.length;
  const listNames = template.structure.lists
    .slice(0, 3)
    .map((list) => list.title)
    .join(', ');
  const hasMore = listCount > 3;

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        selected
          ? 'border-primary ring-2 ring-primary ring-offset-2'
          : 'border-gray-200 hover:border-primary'
      }`}
      onClick={() => onSelect(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {template.icon && (
              <span className="text-2xl" role="img" aria-label="Template icon">
                {template.icon}
              </span>
            )}
            <CardTitle className="text-lg">{template.name}</CardTitle>
          </div>
          {template.is_system && (
            <Badge variant="secondary" className="text-xs">
              System
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {template.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
        )}

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            {listCount} {listCount === 1 ? 'list' : 'lists'}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {listNames}
            {hasMore && `, +${listCount - 3} more`}
          </p>
        </div>

        {selected && (
          <Button size="sm" className="w-full mt-2">
            Use This Template
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
