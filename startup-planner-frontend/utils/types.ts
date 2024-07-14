
export interface IconProps extends React.SVGProps<SVGSVGElement> { }
export interface AvatarProps {
  src: string;
  fallback: string;
}


export type AccountData = {
  display_name: string,
  email: string,
  bio: string
  avatar?: string,

}

export type BillingData = {
  card_number: string,
  card_expiry: string,
  card_cvc: string,
  card_zip: string,
}

export type SecurityData = {
  current_password: string,
  new_password: string,
  confirm_password: string,
}



export type Business = {
  id: number;
  name: string;
  description: string;
  long_description?: string;
  industry: string;
  stage: 'Idea' | 'MVP' | 'Growth' | 'Maturity';
  stage_description?: string;
  funding_amount: number;
  team_size: number;
  founding_date?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
};


export type NewBusiness = Omit<Business, 'id' | 'created_at' | 'updated_at' | 'user_id'>;


