import Link from 'next/link';
import { LoginForm } from '@/components/LoginForm';
import { Lock as LockIcon } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#05010d] flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}