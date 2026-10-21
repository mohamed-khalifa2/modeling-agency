import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const isLoginPage = request.nextUrl.pathname.startsWith("/admin/login");
  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") && !isLoginPage;

  if (isAdminRoute) {
    let isAdmin = false;

    if (claims?.sub) {
      const { data: adminRow } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", claims.sub)
        .maybeSingle();
      isAdmin = Boolean(adminRow);
    }

    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      const redirect = NextResponse.redirect(url);
      for (const cookie of supabaseResponse.cookies.getAll()) {
        redirect.cookies.set(cookie);
      }
      for (const header of ["cache-control", "expires", "pragma"]) {
        const value = supabaseResponse.headers.get(header);
        if (value) redirect.headers.set(header, value);
      }
      return redirect;
    }
  }

  return supabaseResponse;
}
