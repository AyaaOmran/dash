import { Open_Sans } from "next/font/google";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PermissionsProvider } from '../context/PermissionsContext'

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans", 
  display: "swap",
});

export const metadata = {
  title: "Dashboard",
  description: "Admin Dashboard",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className="antialiased">
        <ToastContainer position="top-right" autoClose={3000} />
        <PermissionsProvider>
          {children}
        </PermissionsProvider>

      </body>
    </html>
  );
}
