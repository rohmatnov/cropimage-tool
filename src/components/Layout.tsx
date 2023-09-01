import React, { FC, ReactNode } from "react";
import { Link } from "gatsby";

type Props = { children: ReactNode };
const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Nav />
      <main className="mt-16 px-6">{children}</main>
    </>
  );
};

const Nav: FC = () => {
  return (
    <nav className="px-6 border-b py-2 fixed w-full bg-white top-0 left-0 right-0 h-16 flex items-center z-10">
      <div>
        <h1 className="font-medium">
          <Link to="/" className="block py-2">
            <span>Image</span>
            <span className="text-emerald-600">Pixel</span>
          </Link>
        </h1>
      </div>
    </nav>
  );
};

export default Layout;
