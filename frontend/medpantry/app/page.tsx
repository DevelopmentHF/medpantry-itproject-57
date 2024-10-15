import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import logo from "@/assets/logo.png";

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  // Authentication
      const {
        data: { user },
      } = await createClient().auth.getUser();

      if (user) {
        redirect("/protected");
        return null;
      }

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
         <img src={logo} alt="Medical Pantry Logo" className="h-10" />
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6 text-center items-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            <span className="text-red-600">Sort</span> it.
            <br />
            <span className="text-red-600">Pack</span> it.
            <br />
            <span className="text-red-600">Supply</span> it.
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Inventory management made easy with Medical Pantry. Effortlessly
            monitor and manage supplies with box-to-box accuracy.
          </p>
          <a href="#key-feat" className="text-red-600 text-lg">
          <button
            style={{ width: "fit-content"}}
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105"
          >
            Discover Smart Warehouse
          </button>
          </a>

          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 id="key-feat" className="text-4xl font-bold text-center text-gray-900 mb-16">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  {
                    title: "Precise Inventory Stocking",
                    description:
                      "QR code scanning ensures accurate inventory counts and location while sorting.",
                  },
                  {
                    title: "Overview of Inventory",
                    description:
                      "Comprehensive view of inventory including changes and updates.",
                  },
                  {
                    title: "Real-time Updates",
                    description:
                      "Instantly sync inventory changes through stocking and packing orders across your entire system.",
                  },
                ].map((feature, index) => (
                  <div key={index} className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>Powered by Team 57</p>
      </footer>
    </div>
  );
}
