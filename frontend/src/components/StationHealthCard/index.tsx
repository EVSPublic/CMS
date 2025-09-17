import Lucide from "@/components/Base/Lucide";
import { StationHealthReport } from "@/services/monitoring";
import clsx from "clsx";

interface StationHealthCardProps {
  healthReport: StationHealthReport;
  onClick?: () => void;
  className?: string;
}

function StationHealthCard({ healthReport, onClick, className }: StationHealthCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "text-success";
      case "maintenance": return "text-warning";
      case "offline": return "text-danger";
      default: return "text-slate-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return "CheckCircle";
      case "maintenance": return "AlertTriangle";
      case "offline": return "XCircle";
      default: return "Circle";
    }
  };

  const formatLastSeen = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const availableChargers = healthReport.chargerHealths.filter(c => c.status === "available").length;
  const totalChargers = healthReport.chargerHealths.length;

  return (
    <div
      className={clsx(
        "p-5 box box--stacked cursor-pointer hover:shadow-lg transition-shadow",
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-theme-1 to-theme-2 flex items-center justify-center">
            <Lucide icon="Zap" className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium">{healthReport.stationName}</h3>
            <p className="text-xs text-slate-500">ID: {healthReport.stationId.substring(0, 8)}...</p>
          </div>
        </div>
        
        <div className="flex items-center">
          {healthReport.isOnline && (
            <div className="flex items-center mr-3">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse mr-2"></div>
              <span className="text-xs text-success">Live</span>
            </div>
          )}
          <div className={clsx("flex items-center", getStatusColor(healthReport.status))}>
            <Lucide
              icon={getStatusIcon(healthReport.status) as any}
              className="w-4 h-4 mr-1"
            />
            <span className="text-sm capitalize">{healthReport.status}</span>
          </div>
        </div>
      </div>

      {/* Charger Status */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Chargers</span>
          <span className="text-sm text-slate-500">
            {availableChargers}/{totalChargers} available
          </span>
        </div>
        
        <div className="flex space-x-1">
          {healthReport.chargerHealths.map((charger, index) => (
            <div
              key={charger.chargerId}
              className={clsx("flex-1 h-2 rounded-full", {
                "bg-success": charger.status === "available",
                "bg-warning": charger.status === "occupied",
                "bg-danger": charger.status === "offline" || charger.status === "error",
                "bg-info": charger.status === "maintenance"
              })}
              title={`Charger ${index + 1}: ${charger.status}`}
            />
          ))}
        </div>
      </div>

      {/* Last Seen */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Last seen:</span>
          <span>{formatLastSeen(healthReport.lastHeartbeat)}</span>
        </div>
      </div>

      {/* Alerts */}
      {healthReport.alerts.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-2 text-warning">
            <Lucide icon="AlertTriangle" className="w-4 h-4 inline mr-1" />
            Alerts ({healthReport.alerts.length})
          </div>
          <div className="space-y-1">
            {healthReport.alerts.slice(0, 2).map((alert, index) => (
              <div key={index} className="text-xs text-warning bg-warning/10 px-2 py-1 rounded">
                {alert}
              </div>
            ))}
            {healthReport.alerts.length > 2 && (
              <div className="text-xs text-slate-500">
                +{healthReport.alerts.length - 2} more alerts
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charger Details */}
      <div className="space-y-2">
        <div className="text-sm font-medium">Charger Health</div>
        {healthReport.chargerHealths.map((charger) => (
          <div key={charger.chargerId} className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <div className={clsx("w-2 h-2 rounded-full mr-2", {
                "bg-success": charger.status === "available",
                "bg-warning": charger.status === "occupied",
                "bg-danger": charger.status === "offline",
                "bg-info": charger.status === "maintenance"
              })}></div>
              <span>{charger.chargerId.substring(0, 8)}...</span>
            </div>
            <div className="flex items-center space-x-2">
              {charger.temperature > 0 && (
                <span className="text-slate-500">{charger.temperature.toFixed(1)}°C</span>
              )}
              {charger.requiresMaintenance && (
                <Lucide icon="AlertTriangle" className="w-3 h-3 text-warning" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StationHealthCard;