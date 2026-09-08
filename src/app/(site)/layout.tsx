import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MaGuyFab from "@/components/layout/MaGuyFab";
import ScrollTopFab from "@/components/layout/ScrollTopFab";
import VerifyEmailBanner from "@/components/auth/VerifyEmailBanner";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[96px]">
        <VerifyEmailBanner />
        {children}
      </main>
      <Footer />
      <MaGuyFab />
      <ScrollTopFab />
    </>
  );
}
