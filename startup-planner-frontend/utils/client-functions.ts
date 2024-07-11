import { AccountData } from "./types";


export function getFallBackName(accountData: AccountData) {
  const display_name = accountData.display_name;

  if (!display_name || display_name.length < 2) {
    return "";
  }

  return (display_name[0] + display_name[display_name.length - 1]).toUpperCase();
}




