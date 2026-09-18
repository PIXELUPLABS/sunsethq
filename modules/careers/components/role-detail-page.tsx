import { PrimaryButtonHover } from "@/components/ui/primary-button-hover";
import Link from "next/link";
import { Footer } from "@/modules/landing/components/footer";
import { Navbar } from "@/modules/landing/components/navbar";
import type { Role } from "../types";

type RoleDetailPageProps = {
  role: Role;
};

export function RoleDetailPage({ role }: RoleDetailPageProps) {
  return (
    <div className="flex flex-col">
      <Navbar linkBase="/" />
      <main className="flex flex-col">
        <section className="relative overflow-hidden bg-[#fcfcfc]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[url('/images/grain-light-texture.svg')] bg-top bg-repeat bg-[length:100%_auto]"
          />

          <div className="relative mx-auto w-full max-w-[1560px] border border-dashed border-[#d4d4d4]">
            <div className="mx-auto flex w-full max-w-[760px] flex-col items-start gap-10 px-6 pt-[108px] pb-16 lg:px-0 lg:pt-[160px] lg:pb-24">
              <Link
                href="/careers#open-roles"
                className="group flex items-center gap-1.5 font-mono text-xs tracking-wide text-[#727272] uppercase transition-colors duration-200 ease-snap hover:text-black"
              >
                <span
                  aria-hidden
                  className="transition-transform duration-200 ease-snap [@media(hover:hover)]:group-hover:-translate-x-[3px]"
                >
                  &larr;
                </span>
                All open roles
              </Link>

              <div className="flex flex-col items-start gap-5">
                <h1 className="font-serif text-[42px] leading-[1.035] tracking-[-1.75px] text-black sm:text-[56px] sm:leading-none sm:tracking-tight">
                  {role.title}
                </h1>
                <p className="flex flex-wrap gap-x-3 font-mono text-xs tracking-wide text-[#919191] uppercase">
                  <span>{role.location}</span>
                  <span>{role.employmentType}</span>
                  {role.compensation ? <span>{role.compensation}</span> : null}
                </p>
              </div>

              <div
                className="flex w-full flex-col text-sm leading-[1.6] text-[#727272] [&_a]:text-black [&_a]:underline [&_a]:decoration-[#d4d4d4] [&_a]:underline-offset-4 [&_a:hover]:decoration-black [&_h2]:mt-6 [&_h2]:font-serif [&_h2]:text-[20px] [&_h2]:text-black [&_h2]:first:mt-0 [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-black [&_h3]:first:mt-0 [&_li]:mt-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_p:empty]:hidden [&>p:has(>strong:only-child)]:mt-6 [&>p:has(>strong:only-child)]:first:mt-0 [&_strong]:font-medium [&_strong]:text-[#4a4a4a] [&>p:has(>strong:only-child)>strong]:font-serif [&>p:has(>strong:only-child)>strong]:text-[20px] [&>p:has(>strong:only-child)>strong]:font-normal [&>p:has(>strong:only-child)>strong]:text-black [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: role.description }}
              />

              <a
                href={role.applyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-13 w-[300px] max-w-full items-center justify-center overflow-hidden bg-[#141518] transition-transform duration-150 ease-snap active:scale-[0.97] lg:h-auto lg:w-auto lg:px-10 lg:py-6"
              >
                <PrimaryButtonHover />
                <span className="relative font-serif text-xs leading-[0.8] tracking-wide text-white uppercase lg:text-base">
                  Apply
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
