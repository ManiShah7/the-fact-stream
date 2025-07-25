import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings as SettingsIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

type FormState = {
  isLoading: boolean;
  success: string;
  error: string;
};

const Settings = () => {
  const [currentEmail, setCurrentEmail] = useState("user@example.com");
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailFormState, setEmailFormState] = useState<FormState>({
    isLoading: false,
    success: "",
    error: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFormState, setPasswordFormState] = useState<FormState>({
    isLoading: false,
    success: "",
    error: "",
  });

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail || !emailPassword) {
      setEmailFormState({
        isLoading: false,
        success: "",
        error: "All fields are required",
      });
      return;
    }

    if (newEmail === currentEmail) {
      setEmailFormState({
        isLoading: false,
        success: "",
        error: "New email must be different from current email",
      });
      return;
    }

    setEmailFormState({ isLoading: true, success: "", error: "" });

    try {
      // Simulate success
      setCurrentEmail(newEmail);
      setNewEmail("");
      setEmailPassword("");
      setEmailFormState({
        isLoading: false,
        success:
          "Email updated successfully! Please check your new email for verification.",
        error: "",
      });
    } catch (error) {
      console.error(error);
      setEmailFormState({
        isLoading: false,
        success: "",
        error: "Failed to update email. Please try again.",
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFormState({
        isLoading: false,
        success: "",
        error: "All fields are required",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFormState({
        isLoading: false,
        success: "",
        error: "New passwords do not match",
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordFormState({
        isLoading: false,
        success: "",
        error: "Password must be at least 8 characters long",
      });
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordFormState({
        isLoading: false,
        success: "",
        error: "New password must be different from current password",
      });
      return;
    }

    setPasswordFormState({ isLoading: true, success: "", error: "" });

    try {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordFormState({
        isLoading: false,
        success: "Password updated successfully!",
        error: "",
      });
    } catch (error) {
      console.error(error);
      setPasswordFormState({
        isLoading: false,
        success: "",
        error:
          "Failed to update password. Please check your current password and try again.",
      });
    }
  };

  const clearAlert = (type: "email" | "password") => {
    setTimeout(() => {
      if (type === "email") {
        setEmailFormState((prev) => ({ ...prev, success: "", error: "" }));
      } else {
        setPasswordFormState((prev) => ({ ...prev, success: "", error: "" }));
      }
    }, 5000);
  };

  if (emailFormState.success || emailFormState.error) {
    clearAlert("email");
  }
  if (passwordFormState.success || passwordFormState.error) {
    clearAlert("password");
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 p-4 border-b">
        <SettingsIcon className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-xl font-semibold">Account Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your email address and password
          </p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Change Email Address
            </CardTitle>
            <CardDescription>
              Update your email address. You'll need to verify your new email
              address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Email</Label>
              <div className="p-3 bg-muted rounded-md text-sm">
                {currentEmail}
              </div>
            </div>

            <form onSubmit={handleEmailChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-email">New Email Address</Label>
                <Input
                  id="new-email"
                  type="email"
                  placeholder="Enter new email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={emailFormState.isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="email-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password to confirm"
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    disabled={emailFormState.isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={emailFormState.isLoading}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {emailFormState.success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {emailFormState.success}
                  </AlertDescription>
                </Alert>
              )}

              {emailFormState.error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {emailFormState.error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={
                  emailFormState.isLoading || !newEmail || !emailPassword
                }
                className="w-full sm:w-auto"
              >
                {emailFormState.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Email...
                  </>
                ) : (
                  "Update Email"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password. Make sure it's at least 8 characters long.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={passwordFormState.isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={passwordFormState.isLoading}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password (min. 8 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={passwordFormState.isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={passwordFormState.isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={passwordFormState.isLoading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={passwordFormState.isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {passwordFormState.success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {passwordFormState.success}
                  </AlertDescription>
                </Alert>
              )}

              {passwordFormState.error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {passwordFormState.error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                <p className="font-medium mb-1">Password requirements:</p>
                <ul className="space-y-1 text-xs">
                  <li
                    className={`flex items-center gap-2 ${
                      newPassword.length >= 8 ? "text-green-600" : ""
                    }`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${
                        newPassword.length >= 8
                          ? "bg-green-600"
                          : "bg-muted-foreground"
                      }`}
                    />
                    At least 8 characters long
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      newPassword !== currentPassword && newPassword
                        ? "text-green-600"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${
                        newPassword !== currentPassword && newPassword
                          ? "bg-green-600"
                          : "bg-muted-foreground"
                      }`}
                    />
                    Different from current password
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      newPassword === confirmPassword &&
                      newPassword &&
                      confirmPassword
                        ? "text-green-600"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${
                        newPassword === confirmPassword &&
                        newPassword &&
                        confirmPassword
                          ? "bg-green-600"
                          : "bg-muted-foreground"
                      }`}
                    />
                    Passwords match
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={
                  passwordFormState.isLoading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className="w-full sm:w-auto"
              >
                {passwordFormState.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
