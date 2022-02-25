import { NextPage } from 'next';

// Reference
// string, number, boolean, object, Record<K,V>, Map<K,V>, Set<K,V>, Type | Interface, Enum, Array<T>, T[]

type DashboardProps = {
  todos: Todo[];
};

const Dashboard: NextPage<DashboardProps> = ({ todos }) => {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl text-center">Dashboard</h1>

      <div className="flex items-center justify-center min">
        <div>
          {todos.length === 0 && <p>Njet todos</p>}

          {todos.length > 0 && (
            <table className="table-fixed">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>User</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo) => (
                  <tr key={todo.id}>
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
  );
};

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type Pol = 'm' | 'z';

// Omit helper
type CreateTodo = Omit<Todo, 'id' | 'completed'>;
// Pick helper
type CreateTodoV2 = Pick<Todo, 'title' | 'userId'>;

Dashboard.getInitialProps = async (ctx) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=20');
  const data = (await response.json()) as Todo[];

  return {
    todos: data,
  };
};

export default Dashboard;
const platform = new Map<string, number>([['linux', 1]]);

const a = platform.get('linux');

a?.toExponential();
