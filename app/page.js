import Business from "@/components/business";
import Health from "@/components/health";
import Politics from "@/components/politics";
import Technology from "@/components/technology";
import Lifestyle from "@/components/lifestyle";
import Sports from "@/components/sports";

export default function Home() {
  return (
    <main>
      <Business />
      <Health />
      <Politics />
      <Technology />
      <Lifestyle />
      <Sports />
    </main>
  );
}