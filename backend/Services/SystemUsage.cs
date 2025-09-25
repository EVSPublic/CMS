namespace AdminPanel.Services
{
    using System;
    using System.Diagnostics;
    using System.IO;
    using System.Threading.Tasks;

    public class SystemUsage
    {
        /// <summary>
        /// CPU usage for current process (%)
        /// Works cross-platform.
        /// </summary>
        public static async Task<float> GetCpuUsageForProcess(int delay = 500)
        {
            using (Process proc = Process.GetCurrentProcess())
            {
                TimeSpan startCpu = proc.TotalProcessorTime;
                DateTime startTime = DateTime.UtcNow;

                await Task.Delay(delay);

                TimeSpan endCpu = proc.TotalProcessorTime;
                DateTime endTime = DateTime.UtcNow;

                double cpuUsedMs = (endCpu - startCpu).TotalMilliseconds;
                double totalMsPassed = (endTime - startTime).TotalMilliseconds * Environment.ProcessorCount;

                return (float)(cpuUsedMs / totalMsPassed * 100);
            }
        }

        /// <summary>
        /// System-wide CPU usage (%) – Linux only (/proc/stat).
        /// </summary>
        public static async Task<float> GetSystemCpuUsage(int delay = 500)
        {
            var (idle1, total1) = ReadProcStat();
            await Task.Delay(delay);
            var (idle2, total2) = ReadProcStat();

            double idleDelta = idle2 - idle1;
            double totalDelta = total2 - total1;

            return (float)((1.0 - idleDelta / totalDelta) * 100.0);
        }

        private static (long idle, long total) ReadProcStat()
        {
            string line = File.ReadLines("/proc/stat").First();
            string[] parts = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            // fields: cpu user nice system idle iowait irq softirq steal guest guest_nice
            long user = long.Parse(parts[1]);
            long nice = long.Parse(parts[2]);
            long system = long.Parse(parts[3]);
            long idle = long.Parse(parts[4]);
            long iowait = parts.Length > 5 ? long.Parse(parts[5]) : 0;
            long irq = parts.Length > 6 ? long.Parse(parts[6]) : 0;
            long softirq = parts.Length > 7 ? long.Parse(parts[7]) : 0;
            long steal = parts.Length > 8 ? long.Parse(parts[8]) : 0;

            long total = user + nice + system + idle + iowait + irq + softirq + steal;
            return (idle, total);
        }
    }
}
