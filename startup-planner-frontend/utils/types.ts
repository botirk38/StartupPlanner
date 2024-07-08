
export interface IconProps extends React.SVGProps<SVGSVGElement> { }
export interface AvatarProps {
  src: string;
  fallback: string;
}


export type AccountData = {
  display_name: string,
  email: string,
  bio: string
}
