import type { Metadata } from "next";
import { Roboto_Flex, Poppins } from "next/font/google";
import "../styles/globals.css";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { getAuthSession } from "@/utils/auth";
import { EdgeStoreProvider } from "@/utils/edgestore";

const robotoFlex = Roboto_Flex({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], variable: '--font-roboto-flex' });
const poppins = Poppins({ subsets: ["latin"], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], variable: '--font-poppins' })

export const metadata: Metadata = {
  title: "Flinsta",
  description: "",
};

export default async function RootLayout({
  children,
  authModal
}: Readonly<{
  children: React.ReactNode;
  authModal: React.ReactNode
}>) {
  const session = await getAuthSession();

  return (
    <html lang="en">
      <body className={`${robotoFlex.variable} ${poppins.variable}`}>
        <NextAuthProvider session={session}>
          <Toaster richColors position="bottom-right" />
          {authModal}
          <UserProvider>
            <EdgeStoreProvider>
              <ModalProvider>
                <Navbar>
                  {children}
                </Navbar>
              </ModalProvider>
            </EdgeStoreProvider>
          </UserProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
