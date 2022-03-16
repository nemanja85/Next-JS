import { useApp } from '@context/AppContext';
import { NextPage } from 'next';
import Link from 'next/link';

// Reference
// string, number, boolean, object, Record<K,V>, Map<K,V>, Set<K,V>, Type | Interface, Enum, Array<T>, T[]

type DashboardProps = {
  todos: Todo[];
};

const Dashboard: NextPage<DashboardProps> = ({ todos }) => {
  const { user } = useApp();

  const fetchUsers = async () => {
    const response = await fetch('/api/users');

    const data = await response.json();

    console.log(data);
  };

  return (
    <>
      <div className="container mx-auto">
        <Link href="/">
          <a>Login</a>
        </Link>

        <button className="px-4 py-2 text-gray-100 bg-red-500 rounded" onClick={fetchUsers}>
          Refresh
        </button>
        <h1 className="text-4xl text-center dark:text-gray-200">Dashboard, Hi {user?.email}</h1>

        <div className="flex items-center justify-center min">
          <div>
            {todos.length === 0 && <p>No records left</p>}

            {todos.length > 0 && (
              <table className="table-fixed">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                    >
                      Completed
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map((todo) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" data-cy="row" key={todo.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {todo.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {todo.title}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {todo.userId}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {todo.completed ? 'completed' : 'incomplete'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

Dashboard.getInitialProps = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=20');
  const data = (await response.json()) as Todo[];

  return {
    todos: data,
  };
};

export default Dashboard;
