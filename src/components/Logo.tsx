/**
 * The Meat Wash monogram.
 *
 * Rebuilt as vector from the original mark: four capsules (216.2 long,
 * 96.4 thick, at 55.7°) and two teardrops, arranged with 180° rotational
 * symmetry about (560.45, 569.2). The reconstruction matches the original
 * bitmap at IoU 0.969 — the remainder is edge antialiasing.
 *
 * The mark splits along that symmetry: the upper group reads as the "m" of
 * "meat", the lower group as the "w" of "wash". Both are exported on their
 * own so the wordmark can set them as the first letter of each line.
 */

const THICKNESS = 96.4;

const CAPSULES_M = ["M497.4 320.0L619.2 498.6", "M675.1 321.0L796.9 499.6"];
const CAPSULES_W = ["M324.0 638.8L445.8 817.4", "M501.7 639.8L623.5 818.4"];

const DROP_M =
  "M410.4 385.0Q437.4 424.0 464.5 463.0A53.5 53.5 0 1 1 371.7 471.7Q391.0 428.3 410.4 385.0Z";
const DROP_W =
  "M710.5 753.4Q683.5 714.4 656.4 675.4A53.5 53.5 0 1 1 749.2 666.7Q729.9 710.1 710.5 753.4Z";

/* tight boxes around each group and around the whole mark */
export const VIEWBOX = {
  full: "276 272 569 593",
  m: "367 272 478 276",
  w: "276 590 478 276",
} as const;

export const GLYPH_RATIO = 478 / 276;

type SvgProps = { className?: string; style?: React.CSSProperties };

function Strokes({ paths }: { paths: readonly string[] }) {
  return (
    <>
      {paths.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={THICKNESS}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </>
  );
}

/** The complete monogram. */
export function Mark({ className = "", style }: SvgProps) {
  return (
    <svg
      style={style}
      viewBox={VIEWBOX.full}
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Strokes paths={[...CAPSULES_M, ...CAPSULES_W]} />
      <path d={DROP_M} fill="currentColor" />
      <path d={DROP_W} fill="currentColor" />
    </svg>
  );
}

/** Upper half of the mark — stands in for the "m" of "meat". */
export function GlyphM({ className = "", style }: SvgProps) {
  return (
    <svg
      style={style}
      viewBox={VIEWBOX.m}
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Strokes paths={CAPSULES_M} />
      <path d={DROP_M} fill="currentColor" />
    </svg>
  );
}

/** Lower half of the mark — stands in for the "w" of "wash". */
export function GlyphW({ className = "", style }: SvgProps) {
  return (
    <svg
      style={style}
      viewBox={VIEWBOX.w}
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Strokes paths={CAPSULES_W} />
      <path d={DROP_W} fill="currentColor" />
    </svg>
  );
}

/**
 * "meat wash", set on two lines with the monogram supplying both initials —
 * the arrangement the mark itself is drawn in.
 *
 * Each glyph is an inline-block sitting on the baseline, sized to the font's
 * x-height, so it lines up with the lowercase letters exactly the way a real
 * "m" and "w" would. A hair of overshoot compensates for the round caps, the
 * same way a typeface overshoots its round letters.
 */
export function Wordmark({
  className = "",
  inline = false,
}: {
  className?: string;
  inline?: boolean;
}) {
  // Sits on the baseline at x-height, with a hair of overshoot for the round
  // caps and a sliver of sidebearing so it breathes like a real letter.
  const glyph =
    "inline-block w-auto align-baseline translate-y-[0.012em] h-[0.55em] mr-[0.05em]";

  const meat = (
    <span className="whitespace-nowrap">
      <GlyphM className={glyph} />
      eat
    </span>
  );
  const wash = (
    <span className="whitespace-nowrap">
      <GlyphW className={glyph} />
      ash
    </span>
  );

  if (inline) {
    return (
      <span
        className={`inline-flex items-baseline gap-[0.3em] font-extrabold lowercase leading-none tracking-[-0.045em] ${className}`}
      >
        {meat}
        {wash}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex flex-col items-start font-extrabold lowercase leading-[1.02] tracking-[-0.045em] ${className}`}
    >
      {meat}
      {wash}
    </span>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return <Wordmark className={className} />;
}
