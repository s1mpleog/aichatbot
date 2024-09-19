import React, { FC } from "react";
import Sidebar from "./components/Sidebar";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="">
      <aside>
        <Sidebar />
      </aside>
      <main className="ml-[300px]">
        <div className="ml-auto">{children}</div>
      </main>
    </div>
  );
};

export default RootLayout;
