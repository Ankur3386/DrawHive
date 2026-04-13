import React, { useState } from "react";

const COLORS = [
  { bg: "#000000", label: "Black" },
  { bg: "#e03131", label: "Red" },
  { bg: "#f08c00", label: "Orange" },
  { bg: "#2f9e44", label: "Green" },
  { bg: "#1971c2", label: "Blue" },
  { bg: "#ae3ec9", label: "Purple" },
  { bg: "#ffffff", label: "White", border: true },
  { bg: "transparent", label: "None", isTransparent: true },
];

const STROKE_WIDTHS = [
  { value: 1, label: "S", height: "h-[2px]" },
  { value: 2, label: "M", height: "h-[4px]" },
  { value: 4, label: "L", height: "h-[6px]" },
];

const STROKE_STYLES = [
  { x: 0, y: 0,  dasharray: ""    },
  { x: 8, y: 4,  dasharray: "6 3" },
  { x: 2, y: 3,  dasharray: "2 3" },
];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </span>
      {children}
    </div>
  );
}

function ColorSwatch({
  color,
  selected,
  onClick,
}: {
  color: (typeof COLORS)[0];
  selected: boolean;
  onClick: () => void;
}) {
  if (color.isTransparent) {
    return (
      <button
        onClick={onClick}
        title="None"
        className={`
          w-7 h-7 rounded-md cursor-pointer relative overflow-hidden transition-transform
          border-2
          ${selected ? "border-violet-500 scale-110" : "border-gray-200 hover:border-gray-400"}
        `}
      >
        <span className="absolute inset-0 bg-white" />
        <span
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(45deg, #f3f4f6 0px, #f3f4f6 3px, #ffffff 3px, #ffffff 6px)",
          }}
        />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      title={color.label}
      style={{ background: color.bg }}
      className={`
        w-7 h-7 rounded-md cursor-pointer transition-transform
        border-2
        ${selected
          ? "border-violet-500 scale-110 outline outline-2 outline-violet-200"
          : color.border
          ? "border-gray-300 hover:border-gray-400"
          : "border-transparent hover:scale-105"
        }
      `}
    />
  );
}

const Customize = ({
  setBorderColor,
  setfillColor,
  setLineDash,
  setWidth,
}: {
  setBorderColor: (color: string) => void;
  setfillColor: (color: string) => void;
  setLineDash: (dash: { x: number; y: number }) => void;
  setWidth: (size: number) => void;
}) => {
  const [selectedStroke, setSelectedStroke] = useState<number>(0);
  const [selectedBg, setSelectedBg] = useState<number>(7);
  const [selectedWidth, setSelectedWidth] = useState<number>(0);
  const [selectedStyle, setSelectedStyle] = useState<number>(0);

  return (
    <div className="absolute top-20 left-3 w-[230px] bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-5 shadow-lg z-10">

      <Section label="Stroke">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c, i) => (
            <ColorSwatch
              key={i}
              color={c}
              selected={selectedStroke === i}
              onClick={() => { setBorderColor(c.bg); setSelectedStroke(i); }}
            />
          ))}
        </div>
      </Section>

      <Section label="Background">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c, i) => (
            <ColorSwatch
              key={i}
              color={c}
              selected={selectedBg === i}
              onClick={() => { setfillColor(c.bg); setSelectedBg(i); }}
            />
          ))}
        </div>
      </Section>

      <div className="border-t border-gray-100" />

      <Section label="Stroke width">
        <div className="flex gap-2">
          {STROKE_WIDTHS.map((w, i) => (
            <button
              key={i}
              onClick={() => { setWidth(w.value); setSelectedWidth(i); }}
              className={`
                flex-1 h-9 rounded-lg border-2 flex items-center justify-center gap-2
                text-xs font-semibold transition-all
                ${selectedWidth === i
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              <span className={`block w-4 ${w.height} rounded-full bg-current`} />
              {w.label}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Stroke style">
        <div className="flex gap-2">
          {STROKE_STYLES.map((s, i) => (
            <button
              key={i}
              onClick={() => { setLineDash({ x: s.x, y: s.y }); setSelectedStyle(i); }}
              className={`
                flex-1 h-9 rounded-lg border-2 flex items-center justify-center transition-all
                ${selectedStyle === i
                  ? "border-violet-500 bg-violet-50 text-violet-600"
                  : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              <svg viewBox="0 0 28 12" width="28" height="12">
                <line
                  x1="2" y1="6" x2="26" y2="6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray={s.dasharray || undefined}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ))}
        </div>
      </Section>

    </div>
  );
};

export default Customize;