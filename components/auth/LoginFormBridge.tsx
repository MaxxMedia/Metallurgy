"use client";



import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";



import {

  dashboardPathForRole,

  getApiBaseUrl,

  writeSession,

  type AuthSession,

} from "@/lib/auth/session";



/**

 * Hooks the exported Elementor login form (#login_form) to metrology-backend

 * instead of WordPress admin-ajax.php (which does not exist in Next.js).

 */

export function LoginFormBridge() {

  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const [pending, setPending] = useState(false);



  useEffect(() => {

    let attachedForm: HTMLFormElement | null = null;



    const onSubmit = async (event: Event) => {

      const form = event.currentTarget as HTMLFormElement;

      if (form.id !== "login_form") return;



      event.preventDefault();

      event.stopPropagation();

      if (typeof event.stopImmediatePropagation === "function") {

        event.stopImmediatePropagation();

      }



      setError(null);

      setPending(true);



      const fd = new FormData(form);

      const user_name = String(
        fd.get("user_name") ?? fd.get("email") ?? fd.get("username") ?? ""
      ).trim();

      const password = String(fd.get("password") ?? "");



      if (!user_name || !password) {

        setError("Enter your email/username and password.");

        setPending(false);

        return;

      }



      try {

        const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {

          method: "POST",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ email: user_name, password }),

        });



        const data = (await res.json().catch(() => ({}))) as {

          error?: string;

          token?: string;

          user?: AuthSession["user"];

          permissions?: string[];

        };



        if (!res.ok) {

          setError(data.error || "Login failed. Check your credentials.");

          setPending(false);

          return;

        }



        if (!data.token || !data.user) {

          setError("Invalid server response.");

          setPending(false);

          return;

        }



        const session: AuthSession = {

          token: data.token,

          user: data.user,

          permissions: data.permissions ?? [],

        };

        writeSession(session);



        router.push(dashboardPathForRole(data.user.role));

        router.refresh();

      } catch {

        setError(

          "Could not reach the API. Start metrology-backend on port 4000.",

        );

        setPending(false);

      }

    };



    const bindForm = (form: HTMLFormElement) => {

      if (attachedForm === form) return;

      if (attachedForm) {

        attachedForm.removeEventListener("submit", onSubmit, true);

      }

      attachedForm = form;

      form.setAttribute("method", "post");

      form.setAttribute("action", "javascript:void(0)");

      form.addEventListener("submit", onSubmit, true);

    };



    const tryAttach = () => {

      const form = document.getElementById("login_form");

      if (form instanceof HTMLFormElement) bindForm(form);

    };



    tryAttach();



    const observer = new MutationObserver(tryAttach);

    observer.observe(document.body, { childList: true, subtree: true });



    return () => {

      observer.disconnect();

      if (attachedForm) {

        attachedForm.removeEventListener("submit", onSubmit, true);

        attachedForm = null;

      }

    };

  }, [router]);



  if (!error && !pending) return null;



  return (

    <div

      className="mx-auto mt-4 max-w-md px-4 text-center text-sm"

      role="status"

    >

      {pending ? (

        <p className="text-white/70">Signing in…</p>

      ) : (

        <p className="text-red-400">{error}</p>

      )}

    </div>

  );

}


