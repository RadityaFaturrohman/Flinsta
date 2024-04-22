import Navbar from "@/components/Navbar";
import Image from "next/image";
import PinList from "./components/PinList";

export default function Home() {
  return (
    <div className="flex flex-col pb-6 bg-light">
      <PinList />
    </div>
  );
}
