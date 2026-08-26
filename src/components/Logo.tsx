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
  w: "276 591 478 274",
} as const;

export const GLYPH_RATIO = { m: 478 / 276, w: 478 / 274 };

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
 * "meat wash" with the monogram supplying both initials.
 *
 * `stacked` sets the two lines under each other — the arrangement the mark
 * was drawn for, since the halves then sit exactly as they do in the logo.
 * The inline form keeps the same substitution on a single line.
 */
export function Wordmark({
  className = "",
  stacked = false,
}: {
  className?: string;
  stacked?: boolean;
}) {
  const glyph = "block w-auto shrink-0 self-end";
  // The glyphs stand on the baseline at cap height for "m" / "w": tuned so the
  // capsule ends line up with the x-height of the wordmark's own type.
  const glyphBox = { height: "0.62em" };

  if (stacked) {
    return (
      <span
        className={`inline-flex flex-col font-extrabold lowercase leading-[0.9] tracking-[-0.05em] ${className}`}
      >
        <span className="flex items-end gap-[0.1em]">
          <GlyphM className={glyph} style={glyphBox} />
          <span className="leading-none">eat</span>
        </span>
        <span className="flex items-end gap-[0.1em]">
          <GlyphW className={glyph} style={glyphBox} />
          <span className="leading-none">ash</span>
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-end gap-[0.34em] font-extrabold lowercase leading-none tracking-[-0.05em] ${className}`}
    >
      <span className="flex items-end gap-[0.1em]">
        <GlyphM className={glyph} style={glyphBox} />
        <span className="leading-none">eat</span>
      </span>
      <span className="flex items-end gap-[0.1em]">
        <GlyphW className={glyph} style={glyphBox} />
        <span className="leading-none">ash</span>
      </span>
    </span>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return <Wordmark className={className} />;
}
