import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { useLabels } from "@/hooks/useLabels";
import { cn } from "@/lib/utils";

interface LabelCreatorProps {
  boardId: string;
  open: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Yellow", value: "#eab308" },
  { name: "Lime", value: "#84cc16" },
  { name: "Green", value: "#22c55e" },
  { name: "Emerald", value: "#10b981" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Slate", value: "#64748b" },
];

export const LabelCreator = ({
  boardId,
  open,
  onClose,
}: LabelCreatorProps) => {
  const { createLabel } = useLabels(boardId);
  const [labelName, setLabelName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);
  const [customColor, setCustomColor] = useState("");

  const handleCreate = () => {
    const color = customColor || selectedColor;
    if (labelName.trim() && color) {
      createLabel.mutate(
        {
          board_id: boardId,
          name: labelName.trim(),
          color,
        },
        {
          onSuccess: () => {
            setLabelName("");
            setSelectedColor(PRESET_COLORS[0].value);
            setCustomColor("");
            onClose();
          },
        }
      );
    }
  };

  const handleClose = () => {
    setLabelName("");
    setSelectedColor(PRESET_COLORS[0].value);
    setCustomColor("");
    onClose();
  };

  const displayColor = customColor || selectedColor;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Label</DialogTitle>
          <DialogDescription>
            Create a new label for your board
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Label Name */}
          <div className="space-y-2">
            <Label htmlFor="label-name">Label Name</Label>
            <Input
              id="label-name"
              placeholder="e.g., Bug, Feature, Documentation..."
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              maxLength={50}
            />
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="p-3 border rounded-lg bg-muted/50">
              <div
                className="inline-block px-3 py-1 rounded text-white font-medium text-sm"
                style={{ backgroundColor: displayColor }}
              >
                {labelName || "Label Preview"}
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setSelectedColor(color.value);
                    setCustomColor("");
                  }}
                  className={cn(
                    "w-full aspect-square rounded-md transition-all hover:scale-110",
                    selectedColor === color.value &&
                      !customColor &&
                      "ring-2 ring-primary ring-offset-2"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {selectedColor === color.value && !customColor && (
                    <Check className="w-4 h-4 text-white mx-auto drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div className="space-y-2">
            <Label htmlFor="custom-color">Custom Color (Hex)</Label>
            <div className="flex gap-2">
              <Input
                id="custom-color"
                placeholder="#000000"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                maxLength={7}
                className="flex-1"
              />
              <div
                className="w-10 h-10 rounded border shrink-0"
                style={{
                  backgroundColor: customColor || selectedColor,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter a hex color code (e.g., #FF5733)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!labelName.trim() || createLabel.isPending}
          >
            {createLabel.isPending ? "Creating..." : "Create Label"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
