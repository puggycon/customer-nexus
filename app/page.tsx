import CustomerList from "@/components/CustomerList";
import Header from "@/components/Header";
import { mockCustomers } from "@/components/mockCustomers";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <CustomerList initialCustomers={mockCustomers} />
      </div>
    </div>
  );
}
