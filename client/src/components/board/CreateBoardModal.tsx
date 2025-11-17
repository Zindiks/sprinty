import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TemplateGalleryModal } from "@/components/templates/TemplateGalleryModal";

export function CreateBoardModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Create Board
      </Button>
      <TemplateGalleryModal open={open} onOpenChange={setOpen} />
    </>
  );
}
