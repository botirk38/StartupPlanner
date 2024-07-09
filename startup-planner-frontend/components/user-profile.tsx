"use client"

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AccountData } from "@/utils/types";
import UserProfileHeader from "./user-profile/user-profile-header";
import AccountForm from "./user-profile/account-form";
import BillingForm from "./user-profile/billing-form";
import SecurityForm from "./user-profile/security-form";
import { BillingData } from "@/utils/types";

interface UserProfileProps {
  accountData: AccountData;
  billingData: BillingData;
}

const UserProfile: React.FC<UserProfileProps> = ({ accountData, billingData }) => {
  const [avatarUrl, setAvatarUrl] = useState(accountData.avatar);

  return (
    <div className="flex flex-col min-h-dvh dark:bg-gray-900 dark:text-white">
      <UserProfileHeader accountData={accountData} avatarUrl={avatarUrl} />
      <main className="flex-1 p-3 md:p-8">
        <Tabs defaultValue="account" className="w-full max-w-3xl mx-auto py-8">
          <TabsList className="border-b dark:border-gray-700 dark:bg-gray-700">
            <TabsTrigger value="account" className="dark:text-gray-200 dark:hover:bg-white dark:hover:text-black dark:active:hover:text-white">Account</TabsTrigger>
            <TabsTrigger value="billing" className="dark:text-gray-200 dark:hover:bg-white dark:hover:text-black dark:active:hover:text-white">Billing</TabsTrigger>
            <TabsTrigger value="security" className="dark:text-gray-200 dark:hover:bg-white dark:hover:text-black dark:active:hover:text-white">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <AccountForm accountData={accountData} />
          </TabsContent>
          <TabsContent value="billing">
            <BillingForm billingData={billingData} />
          </TabsContent>
          <TabsContent value="security">
            <SecurityForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserProfile;

