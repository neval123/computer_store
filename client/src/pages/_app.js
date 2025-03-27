import '@/styles/globals.css'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/functions/authContext";

export default function App({ Component, pageProps }) {
  return(
        <AuthProvider>
          <Navbar />
            <div className="navbarFooterSetup">
                <Component {...pageProps} />
            </div>
            <Footer/>
        </AuthProvider>
  );
}