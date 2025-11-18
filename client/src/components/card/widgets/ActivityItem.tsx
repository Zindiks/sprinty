import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  UserPlus,
  UserMinus,
  Tag,
  TagIcon,
  MessageSquare,
  Paperclip,
  CheckSquare,
  CheckCircle2,
  Calendar,
  CalendarX,
  Move,
  Archive,
  Edit,
} from "lucide-react";
import type { Activity } from "@/types/types";

interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem = ({ activity }: ActivityItemProps) => {
  const getInitials = (username?: string, email?: string) => {
    if (username) {
      return username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getActivityIcon = () => {
    const iconProps = { className: "w-4 h-4" };

    switch (activity.action_type) {
      case "created":
        return <FileText {...iconProps} />;
      case "updated":
        return <Edit {...iconProps} />;
      case "moved":
        return <Move {...iconProps} />;
      case "archived":
        return <Archive {...iconProps} />;
      case "assignee_added":
        return <UserPlus {...iconProps} />;
      case "assignee_removed":
        return <UserMinus {...iconProps} />;
      case "label_added":
        return <Tag {...iconProps} />;
      case "label_removed":
        return <TagIcon {...iconProps} />;
      case "comment_added":
        return <MessageSquare {...iconProps} />;
      case "attachment_added":
        return <Paperclip {...iconProps} />;
      case "checklist_item_added":
        return <CheckSquare {...iconProps} />;
      case "checklist_item_completed":
        return <CheckCircle2 {...iconProps} />;
      case "due_date_set":
      case "due_date_changed":
        return <Calendar {...iconProps} />;
      case "due_date_removed":
        return <CalendarX {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  const getActivityMessage = () => {
    const username = activity.user.username || activity.user.email || "Someone";
    const metadata = activity.metadata || {};

    switch (activity.action_type) {
      case "created":
        return (
          <>
            <span className="font-medium">{username}</span> created this card
          </>
        );
      case "updated":
        if (metadata.field === "title") {
          return (
            <>
              <span className="font-medium">{username}</span> changed title{" "}
              {metadata.old_value && (
                <>
                  from <span className="italic">"{metadata.old_value}"</span>
                </>
              )}{" "}
              {metadata.new_value && (
                <>
                  to <span className="italic">"{metadata.new_value}"</span>
                </>
              )}
            </>
          );
        }
        if (metadata.field === "description") {
          return (
            <>
              <span className="font-medium">{username}</span>{" "}
              {metadata.old_value ? "updated" : "added"} the description
            </>
          );
        }
        if (metadata.field === "priority") {
          return (
            <>
              <span className="font-medium">{username}</span> changed priority to{" "}
              <span className="font-medium">{metadata.new_value || "none"}</span>
            </>
          );
        }
        if (metadata.field === "status") {
          return (
            <>
              <span className="font-medium">{username}</span> changed status to{" "}
              <span className="font-medium">{metadata.new_value}</span>
            </>
          );
        }
        return (
          <>
            <span className="font-medium">{username}</span> updated this card
          </>
        );
      case "moved":
        return (
          <>
            <span className="font-medium">{username}</span> moved this card
            {metadata.from_list && (
              <>
                {" "}
                from <span className="font-medium">{metadata.from_list}</span>
              </>
            )}
            {metadata.to_list && (
              <>
                {" "}
                to <span className="font-medium">{metadata.to_list}</span>
              </>
            )}
          </>
        );
      case "archived":
        return (
          <>
            <span className="font-medium">{username}</span> archived this card
          </>
        );
      case "assignee_added":
        return (
          <>
            <span className="font-medium">{username}</span> added{" "}
            <span className="font-medium">{metadata.assignee_name || "assignee"}</span>
          </>
        );
      case "assignee_removed":
        return (
          <>
            <span className="font-medium">{username}</span> removed{" "}
            <span className="font-medium">{metadata.assignee_name || "assignee"}</span>
          </>
        );
      case "label_added":
        return (
          <>
            <span className="font-medium">{username}</span> added label{" "}
            {metadata.label_name && (
              <span
                className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
                style={{ backgroundColor: metadata.label_color || "#94a3b8" }}
              >
                {metadata.label_name}
              </span>
            )}
          </>
        );
      case "label_removed":
        return (
          <>
            <span className="font-medium">{username}</span> removed label{" "}
            {metadata.label_name && <span className="font-medium">{metadata.label_name}</span>}
          </>
        );
      case "comment_added":
        return (
          <>
            <span className="font-medium">{username}</span> added a comment
            {metadata.comment_preview && (
              <p className="mt-1 text-sm text-muted-foreground italic pl-4 border-l-2">
                {metadata.comment_preview}
              </p>
            )}
          </>
        );
      case "attachment_added":
        return (
          <>
            <span className="font-medium">{username}</span> attached{" "}
            <span className="font-medium">{metadata.filename || "a file"}</span>
          </>
        );
      case "checklist_item_added":
        return (
          <>
            <span className="font-medium">{username}</span> added checklist item{" "}
            {metadata.item_text && <span className="font-medium">"{metadata.item_text}"</span>}
          </>
        );
      case "checklist_item_completed":
        return (
          <>
            <span className="font-medium">{username}</span>{" "}
            {metadata.completed ? "completed" : "uncompleted"} checklist item{" "}
            {metadata.item_text && <span className="font-medium">"{metadata.item_text}"</span>}
          </>
        );
      case "due_date_set":
        return (
          <>
            <span className="font-medium">{username}</span> set due date to{" "}
            <span className="font-medium">
              {metadata.due_date ? new Date(metadata.due_date).toLocaleDateString() : ""}
            </span>
          </>
        );
      case "due_date_changed":
        return (
          <>
            <span className="font-medium">{username}</span> changed due date to{" "}
            <span className="font-medium">
              {metadata.new_due_date ? new Date(metadata.new_due_date).toLocaleDateString() : ""}
            </span>
          </>
        );
      case "due_date_removed":
        return (
          <>
            <span className="font-medium">{username}</span> removed the due date
          </>
        );
      default:
        return (
          <>
            <span className="font-medium">{username}</span> made a change
          </>
        );
    }
  };

  return (
    <div className="flex gap-3 group">
      {/* Icon */}
      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        {getActivityIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-start gap-2">
          {/* Avatar */}
          <Avatar className="w-6 h-6 flex-shrink-0">
            {activity.user.avatar_url && (
              <AvatarImage
                src={activity.user.avatar_url}
                alt={activity.user.username || activity.user.email}
              />
            )}
            <AvatarFallback className="text-[10px]">
              {getInitials(activity.user.username, activity.user.email)}
            </AvatarFallback>
          </Avatar>

          {/* Message and Time */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">{getActivityMessage()}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(activity.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
