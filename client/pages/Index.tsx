import { BankingLayout } from "@/components/layout/BankingLayout";
import { Dashboard } from "./Dashboard";

export default function Index() {
  return (
    <BankingLayout>
      <Dashboard />
    </BankingLayout>
  );
}
