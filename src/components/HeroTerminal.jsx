import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroConfig } from "../data/heroConfig.js";

gsap.registerPlugin(ScrollTrigger);

export default function HeroTerminal() {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const terminalRef = useRef(null);

  const {
    accentColor,
    ariaLabel,
    backgroundImage,
    backgroundVideo,
    description,
    introLabel,
    introTitle,
    lastLogin,
    name,
    nameAscii,
    portraitAsciiDesktop,
    portraitAsciiMobile,
    promptLine,
    scrollHint,
    typingCursor,
    windowTitle,
  } = heroConfig;

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          })
            .fromTo(
              introRef.current,
              { autoAlpha: 1, y: 0, scale: 1 },
              { autoAlpha: 0.08, y: -90, scale: 0.96, ease: "none" },
              0,
            )
            .fromTo(
              terminalRef.current,
              { y: "22vh", scale: 0.78 },
              { y: "-12vh", scale: 0.96, ease: "none" },
              0,
            );
        },
      );
    }, sectionRef);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100svh] bg-[#efeefe] font-sans md:h-[180svh] motion-reduce:h-auto"
      style={{ "--accent": accentColor }}
      aria-labelledby="hero-title hero-name"
    >
      <div className="relative min-h-[100svh] overflow-visible px-3 py-6 sm:px-6 sm:py-10 md:sticky md:top-0 md:h-[100svh] lg:px-10">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_0%,#000_42%,transparent_100%)]"
          aria-hidden="true"
        >
          <div
            className="absolute inset-[-3%] scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {backgroundVideo ? (
            <video
              className="absolute inset-0 size-full object-cover object-center motion-reduce:hidden"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={backgroundImage}
            >
              <source src={backgroundVideo} type="video/mp4" media="(prefers-reduced-motion: no-preference)" />
            </video>
          ) : null}
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_42%,transparent_0%,rgba(13,14,24,.04)_50%,rgba(18,16,28,.22)_100%)]" />
        </div>

        <header ref={introRef} className="relative z-10 mx-auto flex max-w-4xl flex-col items-center pt-[10svh] text-center text-[#17151d] will-change-transform md:pt-[12svh]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#595365] sm:text-xs">
            {introLabel}
          </p>
          <h1 id="hero-title" className="mt-5 text-balance font-sans text-[clamp(2.6rem,6vw,6rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
            {introTitle}
          </h1>
          <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-[#665f70] sm:text-xs">
            {scrollHint}
          </p>
        </header>

        <div ref={terminalRef} className="relative z-20 mx-auto mt-[10svh] w-full max-w-6xl origin-top overflow-hidden rounded-xl border border-white/10 bg-[#050505]/[0.88] font-terminal [font-variant-ligatures:none] shadow-[0_40px_140px_rgba(0,0,0,0.78)] backdrop-blur-[14px] will-change-transform md:translate-y-[22vh] md:scale-[.78] motion-reduce:translate-y-0 motion-reduce:scale-100">
        <header className="relative flex h-9 items-center border-b border-zinc-400/20 bg-zinc-100/[0.85] px-4 text-xs text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,.65)] backdrop-blur-md">
          <div className="flex gap-2" aria-label="Controles decorativos de ventana">
            <span className="size-3 rounded-full border border-[#b83a32]/30 bg-[#ff5f57] shadow-inner" />
            <span className="size-3 rounded-full border border-[#b27412]/30 bg-[#febc2e] shadow-inner" />
            <span className="size-3 rounded-full border border-[#168023]/30 bg-[#28c840] shadow-inner" />
          </div>
          <p className="pointer-events-none absolute inset-x-16 truncate text-center text-[11px] font-medium tracking-[-0.01em] text-[#55545a] sm:text-xs">
            {windowTitle}
          </p>
        </header>

        <div className="flex min-h-[min(720px,calc(100svh-7rem))] flex-col bg-transparent p-4 text-zinc-100 sm:p-7 lg:p-10">
          <p className="mb-8 text-[10px] leading-relaxed text-zinc-400 sm:text-xs">{lastLogin}</p>

          <div className="grid flex-1 items-center gap-8 lg:grid-cols-[minmax(260px,.72fr)_minmax(0,1.35fr)] lg:gap-12">
            <div className="min-w-0 border-b border-white/8 pb-7 lg:border-r lg:border-b-0 lg:py-3 lg:pr-10">
              <pre
                role="img"
                aria-label={ariaLabel}
                className="hidden overflow-x-auto text-center text-[clamp(7px,.72vw,10px)] leading-[1.08] tracking-[-0.06em] text-zinc-300 select-none lg:block"
              >
                {portraitAsciiDesktop}
              </pre>
              <pre
                role="img"
                aria-label={ariaLabel}
                className="overflow-x-auto text-center text-[clamp(8px,2.25vw,11px)] leading-[1.08] tracking-[-0.06em] text-zinc-300 select-none lg:hidden"
              >
                {portraitAsciiMobile}
              </pre>
            </div>

            <div className="min-w-0">
              <pre
                aria-hidden="true"
                className="max-w-full overflow-x-auto text-[clamp(4px,1.02vw,12px)] font-bold leading-[1.06] tracking-[-0.08em] text-[var(--accent)] [text-shadow:0_0_24px_color-mix(in_srgb,var(--accent)_18%,transparent)]"
              >
                {nameAscii}
              </pre>
              <h2 id="hero-name" className="sr-only">
                {name}
              </h2>
              <p className="mt-7 max-w-2xl whitespace-pre-line text-pretty text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
                {description}
              </p>
            </div>
          </div>

          <p className="mt-8 text-[10px] leading-relaxed text-zinc-300 sm:text-xs">
            <span style={{ color: "var(--accent)" }}>{promptLine}</span>
            {typingCursor ? (
              <span
                className="ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[0.15em] bg-[var(--accent)] motion-safe:animate-[cursor-blink_1.1s_steps(1)_infinite] motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : null}
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
