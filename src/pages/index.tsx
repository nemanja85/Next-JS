import SEO from '@components/SEO/SEO';
import { useApp } from '@context/AppContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '@lib/validations';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

export type Theme = 'dark' | 'light';

type Payload = {
  email: string;
  password: string;
};

const Home: NextPage = () => {
  const router = useRouter();
  const { persistUser, toggleTheme, theme } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Payload>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (payload: Payload) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    const data = await response.json();

    persistUser(data);

    router.push('/dashboard');
  };

  const handleChange = () => toggleTheme();

  return (
    <>
      <SEO description="Page description" title="Home" keywords="next, home" />

      <div className="w-full px-52">
        <div className="container flex justify-start">
          <button
            data-cy="toggleTheme"
            className="px-8 py-4 text-sm bg-yellow-500 text-yellow-1 00 dark:bg-green-800"
            onClick={handleChange}
          >
            {theme === 'dark' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="w-full p-12">
        <div className="container flex justify-center mx-auto">
          <div className="w-1/2 p-12 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="relative z-0 w-full mb-6 group">
                <input
                  data-cy="email"
                  {...register('email')}
                  type="text"
                  name="email"
                  className="block py-2.5 px-0 w-full form-Input text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="floating_email"
                  className="absolute form-Input text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
                <p className="text-red-500">{errors.email?.message}</p>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <input
                  data-cy="password"
                  {...register('password')}
                  type="password"
                  name="password"
                  className="block py-2.5 px-0 w-full form-Input text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className="absolute form-Input text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Password
                </label>
                <p className="text-red-500">{errors.password?.message}</p>
              </div>
              <div className="w-full">
                <button
                  data-cy="submit"
                  type="submit"
                  className="block px-8 py-4 mx-auto text-blue-100 bg-blue-500 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div className="w-1/2 bg-gray-500">
            <img loading="lazy" src="/developers_debugging.png" className="" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
