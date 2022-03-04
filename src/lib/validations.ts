import { object, string } from 'yup';

export const schema = object({
  email: string().required('E Mail is required.').email('Invalid email address'),
  password: string().required('Password is required.'),
});
