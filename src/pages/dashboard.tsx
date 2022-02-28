import { NextPage } from 'next';
import Link from 'next/link';
import { useApp } from '../context/AppContext';

// Reference
// string, number, boolean, object, Record<K,V>, Map<K,V>, Set<K,V>, Type | Interface, Enum, Array<T>, T[]

type DashboardProps = {
  todos: Todo[];
};

const Dashboard: NextPage<DashboardProps> = ({ todos }) => {
  const { user } = useApp();

  return (
    <>
      <div className="container mx-auto">
        <Link href="/">
          <a>Login</a>
        </Link>
        <h1 className="text-4xl text-center dark:text-gray-200">Dashboard, Hi {user?.email}</h1>

        <div className="flex items-center justify-center min">
          <div>
            {todos.length === 0 && <p>No todos records</p>}

            {todos.length > 0 && (
              <table className="my-8">
                <thead className="font-bold text-gray-800">
                  <tr>
                    <th className="border border-gray-800 dark:text-gray-200 dark:border-gray-200">ID</th>
                    <th className="border border-gray-800 dark:text-gray-200 dark:border-gray-200">Title</th>
                    <th className="border border-gray-800 dark:text-gray-200 dark:border-gray-200">User</th>
                    <th className="border border-gray-800 dark:text-gray-200 dark:border-gray-200">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map((todo) => (
                    <tr
                      className="text-gray-800 border border-gray-800 dark:text-gray-200 dark:border-gray-200"
                      data-cy="row"
                      key={todo.id}
                    >
                      <td>{todo.id}</td>
                      <td>{todo.title}</td>
                      <td>{todo.userId}</td>
                      <td>{todo.completed ? 'completed' : 'incompleted'}</td>
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
