type Variant = "info" | "success" | "warm" | "default";

interface Props {
  label:    string;
  variant?: Variant;
}

const styles: Record<Variant, { bg: string; color: string }> = {
  info:    { bg: "#d4e4f6", color: "#0d1d2a" },
  success: { bg: "#d0e9d4", color: "#0b2013" },
  warm:    { bg: "#ffdcc4", color: "#2f1501" },
  default: { bg: "#e4e3d7", color: "#434843" },
};

export default function AmenityChip({ label, variant = "default" }: Props) {
  const s = styles[variant];
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: s.color,
        background: s.bg,
        borderRadius: "9999px",
        padding: "4px 12px",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
