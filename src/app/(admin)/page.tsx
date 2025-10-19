import type { Metadata } from "next";
import InvestorLanding from '@/components/investor/InvestorLanding';

export const metadata: Metadata = {
  title: "AtlasWealth — Investor Dashboard",
  description: "Investor landing and portfolio overview for AtlasWealth",
};

export default function Ecommerce() {
  return <InvestorLanding />;
}
