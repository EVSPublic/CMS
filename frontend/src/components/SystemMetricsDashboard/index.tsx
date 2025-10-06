import Lucide from "@/components/Base/Lucide";
import ReportLineChart from "@/components/ReportLineChart";
import ReportDonutChart3 from "@/components/ReportDonutChart3";
import { getColor } from "@/utils/colors";
import { SystemHealthSummary } from "@/services/monitoring";
import clsx from "clsx";

interface SystemMetricsDashboardProps {
  systemHealth: SystemHealthSummary;
  className?: string;
}

function SystemMetricsDashboard({ systemHealth, className }: SystemMetricsDashboardProps) {
  const stationUptimePercentage = systemHealth.totalStations > 0 
    ? (systemHealth.onlineStations / systemHealth.totalStations * 100) 
    : 0;

  const chargerUtilizationPercentage = systemHealth.totalChargers > 0
    ? ((systemHealth.occupiedChargers + systemHealth.availableChargers) / systemHealth.totalChargers * 100)
    : 0;

  return (
    <div className={clsx("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5", className)}>
      {/* Stations Overview */}
      <div className="p-5 box box--stacked">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 border rounded-full border-success/10 bg-success/10">
            <Lucide icon="Zap" className="w-6 h-6 text-success fill-success/10" />
          </div>
          <div className="ml-4">
            <div className="text-base font-medium">{systemHealth.onlineStations} Çevrimiçi</div>
            <div className="text-slate-500 mt-0.5">{systemHealth.totalStations} istasyondan</div>
          </div>
        </div>

        <div className="relative mt-5 mb-6 overflow-hidden">
          <div className="absolute inset-0 h-px my-auto tracking-widest text-slate-400/60 whitespace-nowrap leading-[0] text-xs">
            .......................................................................
          </div>
          <ReportLineChart
            className="relative z-10 -ml-1.5"
            height={100}
            index={0}
            borderColor={getColor("success")}
            backgroundColor={getColor("success", 0.3)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-5">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-success/70"></div>
            <div className="ml-2.5 text-xs">Çevrimiçi ({stationUptimePercentage.toFixed(1)}%)</div>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-warning/70"></div>
            <div className="ml-2.5 text-xs">Bakımda ({systemHealth.maintenanceStations})</div>
          </div>
        </div>
      </div>

      {/* Chargers Overview */}
      <div className="p-5 box box--stacked">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 border rounded-full border-primary/10 bg-primary/10">
            <Lucide icon="Battery" className="w-6 h-6 text-primary fill-primary/10" />
          </div>
          <div className="ml-4">
            <div className="text-base font-medium">{systemHealth.availableChargers} Müsait</div>
            <div className="text-slate-500 mt-0.5">{systemHealth.totalChargers} şarj cihazından</div>
          </div>
        </div>

        <div className="relative mt-5 mb-6">
          <ReportDonutChart3 className="relative z-10" height={100} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-5">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-primary/70"></div>
            <div className="ml-2.5 text-xs">Müsait</div>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-warning/70"></div>
            <div className="ml-2.5 text-xs">Dolu</div>
          </div>
        </div>
      </div>

      {/* System Uptime */}
      <div className="p-5 box box--stacked">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 border rounded-full border-info/10 bg-info/10">
            <Lucide icon="Activity" className="w-6 h-6 text-info fill-info/10" />
          </div>
          <div className="ml-4">
            <div className="text-base font-medium">{systemHealth.systemUptimePercentage}%</div>
            <div className="text-slate-500 mt-0.5">Sistem Çalışma Süresi</div>
          </div>
        </div>
        
        <div className="relative mt-5 mb-6 overflow-hidden">
          <div className="absolute inset-0 h-px my-auto tracking-widest text-slate-400/60 whitespace-nowrap leading-[0] text-xs">
            .......................................................................
          </div>
          <ReportLineChart
            className="relative z-10 -ml-1.5"
            height={100}
            index={1}
            borderColor={getColor("info")}
            backgroundColor={getColor("info", 0.3)}
          />
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-5">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-info/70"></div>
            <div className="ml-2.5 text-xs">Çalışma süresi trendi</div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="p-5 box box--stacked">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 border rounded-full border-danger/10 bg-danger/10">
            <Lucide icon="AlertTriangle" className="w-6 h-6 text-danger fill-danger/10" />
          </div>
          <div className="ml-4">
            <div className="text-base font-medium">{systemHealth.criticalAlerts.length}</div>
            <div className="text-slate-500 mt-0.5">Kritik uyarılar</div>
          </div>
        </div>

        <div className="mt-5 space-y-2 min-h-[100px]">
          {systemHealth.criticalAlerts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Lucide icon="CheckCircle" className="w-8 h-8 text-success mx-auto mb-2" />
                <div className="text-sm text-slate-500">Tüm sistemler normal</div>
              </div>
            </div>
          ) : (
            <>
              {systemHealth.criticalAlerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="text-sm text-danger bg-danger/10 px-3 py-2 rounded-lg">
                  <Lucide icon="AlertTriangle" className="w-3 h-3 inline mr-2" />
                  {alert}
                </div>
              ))}
              {systemHealth.criticalAlerts.length > 3 && (
                <div className="text-xs text-center text-slate-500 pt-2">
                  +{systemHealth.criticalAlerts.length - 3} uyarı daha
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="md:col-span-2 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Total Stations */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-700">{systemHealth.totalStations}</div>
              <div className="text-sm text-slate-500">Toplam İstasyon</div>
            </div>
            <Lucide icon="MapPin" className="w-8 h-8 text-slate-400" />
          </div>
        </div>

        {/* Total Chargers */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-700">{systemHealth.totalChargers}</div>
              <div className="text-sm text-slate-500">Toplam Şarj Cihazı</div>
            </div>
            <Lucide icon="Zap" className="w-8 h-8 text-slate-400" />
          </div>
        </div>

        {/* Utilization Rate */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-700">{chargerUtilizationPercentage.toFixed(1)}%</div>
              <div className="text-sm text-slate-500">Kullanım Oranı</div>
            </div>
            <Lucide icon="TrendingUp" className="w-8 h-8 text-slate-400" />
          </div>
        </div>

        {/* Offline Count */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-700">
                {systemHealth.offlineStations + systemHealth.offlineChargers}
              </div>
              <div className="text-sm text-slate-500">Çevrimdışı Birimler</div>
            </div>
            <Lucide icon="WifiOff" className="w-8 h-8 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemMetricsDashboard;