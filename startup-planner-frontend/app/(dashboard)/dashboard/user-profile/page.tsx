import UserProfile from "@/components/user-profile"

import { cookies } from "next/headers";
import { getAccountData } from "@/utils/functions";

async function getBillingData() {
  const cookieStore = cookies();

  const SESSION_ID = cookieStore.get("sessionid");

  if (!SESSION_ID) {
    throw new Error("Session ID not found in cookies.")

  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/billing/`, {

    headers: {
      'Content-Type': 'application/json',
      'Cookie': `sessionid=${SESSION_ID.value}`
    }
  })

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch billing data.")
  }

  return response.json();
}




export default async function UserProfilePage() {


  const accountData = await getAccountData();
  const billingData = await getBillingData();


  console.log("Account Data: ", accountData);

  return (
    <UserProfile accountData={accountData} billingData={billingData} />
  )
}
