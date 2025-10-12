import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { SideBar } from "./sidebar/Sidebar";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
              <SideBar role={"Mentor"}/>

        <div className="flex-1">
          <Hero/>
          <main className="flex-1 container mx-auto py-10">
        {children}
      </main>
        </div>
      </div>
      
      

      <Footer />
    </div>
  );
};

export default DashboardLayout;
