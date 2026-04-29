import { FC, PropsWithChildren } from 'react';

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};

export default AppLayout;
