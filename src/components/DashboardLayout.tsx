import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />

      <main className="flex-1 container mx-auto py-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
