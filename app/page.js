import Image from "next/image";
// import RiderDashboard from "./rider-dashboard/page";
import { User } from "lucide-react";
// import Navbar from "../component/Navbar/Navbar";
import UserDashboard from "./user-dashboard/page";

export default function Home() {
  return (
    <div>
      {/* <Navbar /> */}
      {/* <RiderDashboard /> */}
      <UserDashboard />
    </div>
  );
}
