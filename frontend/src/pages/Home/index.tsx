import Lucide from "@/components/Base/Lucide";

function Home() {
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box p-5">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-pending/10 dark:bg-pending/20 text-pending rounded-full mr-4">
                <Lucide icon="Activity" className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base text-slate-500 dark:text-slate-400">Welcome to</div>
                <div className="text-lg font-semibold text-slate-600 dark:text-slate-300">Admin Panel</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="box p-5">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-success/10 dark:bg-success/20 text-success rounded-full mr-3">
                <Lucide icon="Database" className="w-5 h-5" />
              </div>
              <div className="text-lg font-semibold">System Status</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Database</span>
                <span className="text-success font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">API Services</span>
                <span className="text-success font-medium">Running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">Authentication</span>
                <span className="text-success font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="box p-5">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-warning/10 dark:bg-warning/20 text-warning rounded-full mr-3">
                <Lucide icon="Settings" className="w-5 h-5" />
              </div>
              <div className="text-lg font-semibold">Quick Actions</div>
            </div>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 bg-slate-50 dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-500 rounded-lg transition-colors">
                <Lucide icon="Plus" className="w-4 h-4 mr-3 text-slate-500" />
                <span className="text-slate-600 dark:text-slate-300">Create New Item</span>
              </button>
              <button className="w-full flex items-center p-3 bg-slate-50 dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-500 rounded-lg transition-colors">
                <Lucide icon="BarChart3" className="w-4 h-4 mr-3 text-slate-500" />
                <span className="text-slate-600 dark:text-slate-300">View Analytics</span>
              </button>
              <button className="w-full flex items-center p-3 bg-slate-50 dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-500 rounded-lg transition-colors">
                <Lucide icon="Settings" className="w-4 h-4 mr-3 text-slate-500" />
                <span className="text-slate-600 dark:text-slate-300">Configure Settings</span>
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12">
          <div className="box p-5">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary rounded-full mr-3">
                <Lucide icon="Info" className="w-5 h-5" />
              </div>
              <div className="text-lg font-semibold">Information</div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              This is a simplified admin panel with basic layout and theming preserved.
              New features and content will be added here in the future. The system maintains
              its authentication, navigation, and core infrastructure while providing a clean
              foundation for upcoming developments.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;