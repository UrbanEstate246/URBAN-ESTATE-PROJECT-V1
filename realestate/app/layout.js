import { Bricolage_Grotesque } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import Toaster from "./components/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bricolage",
});

export const metadata = {
  metadataBase: new URL("https://urbanestate.co.ke"),
  title: {
    default: "UrbanEstate Kenya | Homes, rentals and land",
    template: "%s | UrbanEstate Kenya",
  },
  description: "Find houses, apartments, bedsitters, rentals and land for rent and sale across all 47 counties in Kenya. Free to search and free to list.",
  keywords: ["Kenya real estate", "Nairobi property", "homes for sale Kenya", "apartments Nairobi", "land for sale Kenya", "houses for rent Kenya", "Mombasa property", "Kisumu property", "Nakuru land", "Kiambu land", "Kajiado plots"],
  openGraph: {
    title: "UrbanEstate Kenya",
    description: "Find houses, apartments, bedsitters, rentals and land across all 47 counties in Kenya. Free to search and free to list.",
    locale: "en_KE",
    type: "website",
    images: ["/images/kenya/karen-villa.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-KE">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} bg-white antialiased`}
      >
        {children}
        <Footer/>
        <Toaster />
      </body>
    </html>
  );
}
