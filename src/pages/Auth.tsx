import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in or create an account</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
          redirectTo={window.location.origin}
          onlyThirdPartyProviders={false}
          magicLink={false}
          showLinks={false}
          localization={{
            variables: {
              sign_up: {
                email_label: 'Email',
                password_label: 'Create a Password',
                button_label: 'Sign Up',
                loading_button_label: 'Signing Up ...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Don't have an account? Sign up',
              },
              sign_in: {
                email_label: 'Email',
                password_label: 'Your Password',
                button_label: 'Sign In',
                loading_button_label: 'Signing In ...',
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