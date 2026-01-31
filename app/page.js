import Image from "next/image";
import Header from "@/component/Header/Header";
import RiderDashboard from "./rider-dashboard/page";

export default function Home() {
  return (
    <div>
      <Header />
      <RiderDashboard />
    </div>
  );
}
