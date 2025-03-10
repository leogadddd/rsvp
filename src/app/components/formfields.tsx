import { ChangeEvent } from "react";

import { Input } from "@/c/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/c/ui/select";

import { Schoolbell } from "next/font/google";
import { Asterisk } from "lucide-react";

const schoolbell = Schoolbell({
  weight: ["400"],
  style: "normal",
  display: "swap",
  subsets: ["latin"],
});

const FormField: React.FC<{
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}> = ({
  id,
  label,
  type,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => (
  <div className={`${schoolbell.className}`}>
    <label
      htmlFor={id}
      className={`text-base font-bold text-foreground mb-1 flex justify-start`}
    >
      {label} {required && <Asterisk className="h-4 w-4 text-primary" />}
    </label>
    {type === "select" ? (
      <Select value={value}>
        <SelectTrigger className="w-full bg-background-accent border-primary/50 border-2 p-6 drop-shadow-lg cursor-pointer transition-colors duration-300">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((opt) => (
            <SelectItem
              value={opt}
              key={`selectitem-${opt}`}
              className={`${schoolbell.className} text-xl`}
            >
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <Input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="bg-background-accent border-primary/50 border-2 p-6 drop-shadow-lg cursor-pointer transition-colors duration-300"
      />
    )}
  </div>
);

export default FormField;
