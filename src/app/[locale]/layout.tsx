import "../globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UmamiProvider from "next-umami";
import { Roboto } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";

const font = Roboto({
  subsets: ["latin"],
});

const APP_NAME = "Paul Bayfield • Portfolio";
const APP_DEFAULT_TITLE = "Paul Bayfield • Portfolio";
const APP_TITLE_TEMPLATE = "Paul Bayfield • %s ";
const APP_DESCRIPTION =
  "Paul Bayfield's personal portfolio website showcasing projects, experience, and contact information.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: { url: process.env.WEB_URL + "/images/avatar.png" },
    url: process.env.WEB_URL,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: { url: process.env.WEB_URL + "/images/avatar.png" },
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <UmamiProvider
          websiteId="693d9057-a8ae-4f33-af14-3e35d1ee41f0"
          src="https://analytics.bayfield.dev/script.js"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased relative",
          font.className
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-dvh bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 antialiased">
              <Header />
              {children}
              <Separator className="my-10 mx-auto max-w-6xl px-5 md:px-8" />
              <Footer />
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
