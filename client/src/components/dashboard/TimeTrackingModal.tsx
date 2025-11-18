import { useState } from "react";
import { X } from "lucide-react";
import { useCreateTimeLog } from "../../hooks/useTimeTracking";

interface TimeTrackingModalProps {
  cardId: string;
  cardTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TimeTrackingModal = ({
  cardId,
  cardTitle,
  isOpen,
  onClose,
}: TimeTrackingModalProps) => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [description, setDescription] = useState("");

  const createTimeLog = useCreateTimeLog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);

    if (totalMinutes <= 0) {
      alert("Please enter a valid time duration");
      return;
    }

    try {
      await createTimeLog.mutateAsync({
        cardId,
        durationMinutes: totalMinutes,
        description: description || undefined,
      });

      // Reset form
      setHours("");
      setMinutes("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Failed to log time:", error);
      alert("Failed to log time. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Log Time</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card</label>
            <p className="text-gray-900">{cardTitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                Hours
              </label>
              <input
                id="hours"
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">
                Minutes
              </label>
              <input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What did you work on?"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={createTimeLog.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createTimeLog.isPending ? "Logging..." : "Log Time"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
