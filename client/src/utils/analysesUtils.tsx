import { Shield } from "lucide-react";

const getStatusColor = (credibilityScore: number) => {
  if (credibilityScore >= 80) {
    return "bg-green-100 text-green-800 border-green-200";
  } else if (credibilityScore >= 50) {
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  } else {
    return "bg-red-100 text-red-800 border-red-200";
  }
};

const getStatusIcon = (credibilityScore: number) => {
  if (credibilityScore >= 80) {
    return <Shield className="w-5 h-5 text-green-600" />;
  } else if (credibilityScore >= 50) {
    return <Shield className="w-5 h-5 text-yellow-600" />;
  } else {
    return <Shield className="w-5 h-5 text-red-600" />;
  }
};

const getStatusText = (credibilityScore: number) => {
  if (credibilityScore >= 80) {
    return "High";
  } else if (credibilityScore >= 50) {
    return "Medium";
  } else {
    return "Low";
  }
};

export { getStatusColor, getStatusIcon, getStatusText };
