import Business from "@/components/business";
import Health from "@/components/health";
import World from "@/components/world";
import US from "@/components/us";
import Lifestyle from "@/components/lifestyle";
import Sports from "@/components/sports";

export default function Home() {
  return (
    <main>
      <Business />
      <Health />
      <World />
      <US />
      <Lifestyle />
      <Sports />
    </main>
  );
}