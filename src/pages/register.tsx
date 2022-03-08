import SEO from '@components/SEO/SEO';
import { useApp } from '@context/AppContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { object, ref, string } from 'yup';

type RegisterRequest = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

const schema = object({
  email: string().required('Email is required'),
  password: string().required('Password is required'),
  passwordConfirmation: string().oneOf([ref('password'), null], 'Passwords must match'),
});

const Register = () => {
  const { setMessage, setNotificationType, mapColors, resetNotification, message, hasMessage, notificationType } =
    useApp();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (payload: RegisterRequest) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (response.status > 400) {
      setMessage((await response.json()).message);
      setNotificationType('error');

      setTimeout(() => resetNotification(), 1500);
      return;
    }

    if (response.status === 201) {
      const data = (await response.json()) as { id: number };
      console.log(data.id);
      reset();
    }
  };

  return (
    <>
      <SEO description="Register" keywords="register" title="Register" />
      <h1>Register</h1>

      <div className="flex flex-col min-h-screen bg-grey-lighter">
        <div className="container flex flex-col items-center justify-center flex-1 max-w-sm px-2 mx-auto">
          {hasMessage && (
            <div
              className={`w-full p-5 my-4 border-2 border-gray-800 rounded-xl ${mapColors(
                notificationType!
              )} dark:border-gray-200`}
            >
              <p className="text-center text-gray-800 dark:text-gray-100">Message: {message}</p>
            </div>
          )}

          <div className="w-full px-6 py-8 text-black bg-white rounded shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                className="block w-full p-3 mb-4 border rounded border-grey-light"
                placeholder="Email"
                {...register('email')}
              />

              {errors.email && <p className="text-red-500">{errors.email.message}</p>}

              <input
                type="password"
                className="block w-full p-3 mb-4 border rounded border-grey-light"
                placeholder="Password"
                {...register('password')}
              />

              {errors.password && <p className="text-red-500">{errors.password.message}</p>}

              <input
                type="password"
                className="block w-full p-3 mb-4 border rounded border-grey-light"
                placeholder="Confirm Password"
                {...register('passwordConfirmation')}
              />

              {errors.passwordConfirmation && <p className="text-red-500">{errors.passwordConfirmation.message}</p>}

              <button
                type="submit"
                className="w-full py-3 my-1 text-center text-white bg-green-500 rounded hover:bg-green-dark focus:outline-none"
              >
                Create Account
              </button>
            </form>
            <h1 className="mb-8 text-3xl text-center">Sign up</h1>

            <div className="mt-4 text-sm text-center text-grey-dark">
              By signing up, you agree to the
              <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                Terms of Service
              </a>{' '}
              and
              <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                Privacy Policy
              </a>
            </div>
          </div>

          <div className="mt-6 text-grey-dark">
            Already have an account?
            <a className="no-underline border-b border-blue text-blue" href="../login/">
              Log in
            </a>
            .
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
