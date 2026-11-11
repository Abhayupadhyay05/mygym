import { Metadata } from "next"
import MembershipPlansClient from "./PageClient"

export const metadata: Metadata = {
  title: "Membership Plans",
  description: "Choose the perfect membership plan at Premium Fitness Gym. Flexible options for every fitness journey - no hidden fees, cancel anytime.",
}

export default function MembershipPlansPage() {
  return <MembershipPlansClient />
}
