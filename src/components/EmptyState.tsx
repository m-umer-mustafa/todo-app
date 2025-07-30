import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  showAddButton = true,
  onAddClick,
}: EmptyStateProps) {
  return (
    <div className="text-center py-10">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"
      >
        <Icon className="h-8 w-8 text-muted-foreground" />
      </motion.div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {showAddButton && (
        <Button onClick={onAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      )}
    </div>
  );
}