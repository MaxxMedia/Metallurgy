import { HomeNewsletterForm } from "@/components/home/HomeNewsletterForm";

export function HomeNewsletterBand() {
  return (
    <section className="my-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-8 sm:p-12 shadow-2xl">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <HomeNewsletterForm />
    </section>
  );
}
