

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AccountData } from "@/utils/types";

interface UserProfileHeaderProps {
  accountData: AccountData;
  avatarUrl: string | undefined;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ accountData, avatarUrl }) => {
  function getFallBackName() {
    const display_name = accountData.display_name;

    if (!display_name || display_name.length < 2) {
      return "";
    }

    return (display_name[0] + display_name[display_name.length - 1]).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b dark:border-gray-700 px-4 sm:static sm:h-auto sm:border-0 sm:px-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={avatarUrl ?? ""} />
          <AvatarFallback>{getFallBackName()}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <div className="font-medium">{accountData.display_name}</div>
          <div className="text-xs text-muted-foreground dark:text-gray-400">{accountData.email}</div>
        </div>
      </div>
    </header>
  );
};

export default UserProfileHeader;

