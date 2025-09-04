import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  isValid: boolean;
  label: string;
};

const PasswordRequirement = ({ isValid, label }: Props) => {
  return (
    <li
      className={cn("flex items-center gap-2", {
        "text-green-600": isValid,
      })}
    >
      {isValid ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <X className="w-4 h-4 text-gray-600" />
      )}
      {label}
    </li>
  );
};

export default PasswordRequirement;
