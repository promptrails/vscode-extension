import { cn } from "../lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: {
    label: "Success",
    className: "bg-green-800/40 text-green-300",
  },
  failed: {
    label: "Failed",
    className: "bg-red-800/40 text-red-300",
  },
  running: {
    label: "Running",
    className: "bg-blue-800/40 text-blue-300",
  },
  awaiting_approval: {
    label: "Awaiting Approval",
    className: "bg-amber-800/40 text-amber-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-800/40 text-red-300",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-800/40 text-amber-300",
  },
  approved: {
    label: "Approved",
    className: "bg-green-800/40 text-green-300",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-800/40 text-gray-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
