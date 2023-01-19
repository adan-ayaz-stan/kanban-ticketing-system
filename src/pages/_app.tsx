import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { AppProps } from "next/app";

import "../styles/globals.css";
import { supabaseClient } from "@/supabase/supabase.config";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || event === "USER_DELETED") {
      // delete cookies on sign out
      const expires = new Date(0).toUTCString();
      document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
      document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
    } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
      const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
      document.cookie = `my-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
      document.cookie = `my-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
    }
  });

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}
export default MyApp;
