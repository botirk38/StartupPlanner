
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
  has_password_set: boolean,

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
