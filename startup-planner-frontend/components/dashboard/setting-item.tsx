
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";


type SettingItemProps = {
  label: string;
  value: string;
  onValueChange: (value: any) => void;
  options: { value: string; label: string }[];
};

function SettingItem({ label, value, onValueChange, options }: SettingItemProps) {
  return (
    <div className="grid items-center grid-cols-4 gap-4">
      <Label htmlFor={label.toLowerCase()} className="text-right text-gray-900 dark:text-gray-100">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger aria-label={`${label}: ${value}`} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <SelectValue>{options.find(option => option.value === value)?.label}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          {options.map(option => (
            <SelectItem key={option.value} value={option.value} aria-label={option.label}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SettingItem;
