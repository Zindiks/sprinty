import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTemplates } from "@/hooks/useTemplates";
import { useStore } from "@/hooks/store/useStore";
import { TemplateCard } from "./TemplateCard";
import { Template } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useBoard } from "@/hooks/useBoards";
import { useNavigate } from "react-router-dom";

interface TemplateGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplateGalleryModal({ open, onOpenChange }: TemplateGalleryModalProps) {
  const navigate = useNavigate();
  const { organization_id } = useStore();
  const { GetTemplates, createBoardFromTemplate } = useTemplates(organization_id);
  const { createBoard } = useBoard(organization_id);

  const { data: templates, isLoading, error } = GetTemplates();

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [boardTitle, setBoardTitle] = useState("");
  const [boardDescription, setDescription] = useState("");
  const [includeExampleCards, setIncludeExampleCards] = useState(true);
  const [currentTab, setCurrentTab] = useState("pre-built");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter templates based on search query
  const filterTemplates = (templateList: Template[]) => {
    if (!searchQuery) return templateList;
    const query = searchQuery.toLowerCase();
    return templateList.filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.description?.toLowerCase().includes(query)
    );
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    if (!boardTitle) {
      setBoardTitle(template.name);
    }
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const response = await createBoardFromTemplate.mutateAsync({
        template_id: selectedTemplate.id,
        organization_id,
        board_title: boardTitle || selectedTemplate.name,
        include_example_cards: includeExampleCards,
      });

      // Navigate to the new board
      if (response.data?.id) {
        navigate(`/board/${response.data.id}`);
      }

      // Reset and close
      resetForm();
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hook with toast
      console.error("Failed to create board from template:", error);
    }
  };

  const handleCreateBlankBoard = async () => {
    if (!boardTitle) return;

    try {
      await createBoard.mutateAsync({
        title: boardTitle,
        description: boardDescription,
      });

      // Reset and close
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create blank board:", error);
    }
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setBoardTitle("");
    setDescription("");
    setIncludeExampleCards(true);
    setSearchQuery("");
    setCurrentTab("pre-built");
  };

  const handleBack = () => {
    setSelectedTemplate(null);
    setBoardTitle("");
  };

  // Show template selection view
  if (!selectedTemplate) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Board</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div>
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {/* Tabs */}
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pre-built">Pre-built Templates</TabsTrigger>
                <TabsTrigger value="custom">Custom Templates</TabsTrigger>
                <TabsTrigger value="blank">Blank Board</TabsTrigger>
              </TabsList>

              {/* Pre-built Templates Tab */}
              <TabsContent value="pre-built" className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-destructive">
                    Error loading templates: {error.message}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterTemplates(templates?.system || []).map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onSelect={handleTemplateSelect}
                      />
                    ))}
                  </div>
                )}

                {!isLoading && !error && filterTemplates(templates?.system || []).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    {searchQuery
                      ? "No templates found matching your search"
                      : "No pre-built templates available"}
                  </div>
                )}
              </TabsContent>

              {/* Custom Templates Tab */}
              <TabsContent value="custom" className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterTemplates(templates?.custom || []).map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onSelect={handleTemplateSelect}
                      />
                    ))}
                  </div>
                )}

                {!isLoading && filterTemplates(templates?.custom || []).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    {searchQuery
                      ? "No custom templates found matching your search"
                      : "No custom templates yet. Create one by saving a board as a template!"}
                  </div>
                )}
              </TabsContent>

              {/* Blank Board Tab */}
              <TabsContent value="blank" className="space-y-4">
                <div className="max-w-md mx-auto space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="blank-title">Board Title</Label>
                    <Input
                      id="blank-title"
                      value={boardTitle}
                      onChange={(e) => setBoardTitle(e.target.value)}
                      placeholder="Enter board title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blank-description">Description (optional)</Label>
                    <Input
                      id="blank-description"
                      value={boardDescription}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter board description"
                    />
                  </div>
                  <Button
                    onClick={handleCreateBlankBoard}
                    className="w-full"
                    disabled={!boardTitle.trim() || createBoard.isPending}
                  >
                    {createBoard.isPending ? "Creating..." : "Create Blank Board"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show board configuration view (after template selected)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Board from Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Template Preview */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              {selectedTemplate.icon && <span className="text-xl">{selectedTemplate.icon}</span>}
              <span className="font-medium">{selectedTemplate.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedTemplate.structure.lists.length} lists:{" "}
              {selectedTemplate.structure.lists.map((list) => list.title).join(", ")}
            </p>
          </div>

          {/* Board Title Input */}
          <div className="space-y-2">
            <Label htmlFor="board-title">Board Title</Label>
            <Input
              id="board-title"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder="Enter board title"
              required
            />
          </div>

          {/* Include Example Cards Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="example-cards"
              checked={includeExampleCards}
              onCheckedChange={(checked) => setIncludeExampleCards(checked as boolean)}
            />
            <Label htmlFor="example-cards" className="text-sm font-normal cursor-pointer">
              Include example cards
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
            <Button
              onClick={handleCreateFromTemplate}
              className="flex-1"
              disabled={!boardTitle.trim() || createBoardFromTemplate.isPending}
            >
              {createBoardFromTemplate.isPending ? "Creating..." : "Create Board"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
