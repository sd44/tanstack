import { Link, createFileRoute } from '@tanstack/react-router';
import { SignUpForm } from '~/components/myui/signup-form';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export const Route = createFileRoute('/auth/signup')({
  component: SignUp,
});

function SignUp() {
  return (
    <div className="container">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">新用户注册</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />

          <div className="mt-4 text-center text-base">
            已有账户？{' '}
            <Link to="/auth/login" className="underline">
              登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
