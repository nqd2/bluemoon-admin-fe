import DashboardPageView from "./page-view";
import { getDictionary } from "@/app/dictionaries";
import { getDashboardStats } from "@/action/dashboard-action";

export const dynamic = "force-dynamic";

const Dashboard = async () => {
  const trans = await getDictionary();

  // Fetch data
  const statsRes = await getDashboardStats();

  return (
    <DashboardPageView
      stats={statsRes?.data}
    />
  );
};

export default Dashboard;
