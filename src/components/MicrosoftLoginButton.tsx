import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../lib/auth-config';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface MicrosoftLoginButtonProps {
  onLoginSuccess: () => void;
  onLoginError: (error: Error) => void;
}

export function MicrosoftLoginButton({ onLoginSuccess, onLoginError }: MicrosoftLoginButtonProps) {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
      onLoginSuccess();
    } catch (error) {
      onLoginError(error instanceof Error ? error : new Error('Login failed'));
    }
  };

  return (
    <Button
      onClick={handleLogin}
      className="flex items-center gap-2 bg-[#2F2F2F] hover:bg-[#1F1F1F] text-white"
    >
      <LogIn className="w-5 h-5" />
      Sign in with Microsoft
    </Button>
  );
} 