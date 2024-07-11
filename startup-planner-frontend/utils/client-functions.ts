import { AccountData } from "./types";
import { toast } from "@/components/ui/use-toast";

export function getFallBackName(accountData: AccountData) {
  const display_name = accountData.display_name;

  if (!display_name || display_name.length < 2) {
    return "";
  }

  return (display_name[0] + display_name[display_name.length - 1]).toUpperCase();
}

export const handleCanvaLogin = (router: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    toast({
      title: 'Error',
      description: 'Canva login URL is not configured',
      variant: 'destructive',
    });
    return;
  }
  const canvaAuthUrl = `${baseUrl}/canva/auth`;
  router.push(canvaAuthUrl);
};

