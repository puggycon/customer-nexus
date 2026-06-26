import CustomerList from "@/components/CustomerList";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--background)] font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <CustomerList />
      </div>
    </div>
  );
}
