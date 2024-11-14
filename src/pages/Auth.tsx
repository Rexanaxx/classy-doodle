import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in or create an account</p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
          redirectTo={window.location.origin}
          localization={{
            variables: {
              sign_up: {
                email_label: 'Email address',
                password_label: 'Create a Password',
                button_label: 'Sign up',
                loading_button_label: 'Signing Up ...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: "Don't have an account? Sign up",
              },
              sign_in: {
                email_label: 'Email address',
                password_label: 'Your Password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in ...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Already have an account? Sign in',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AuthPage;