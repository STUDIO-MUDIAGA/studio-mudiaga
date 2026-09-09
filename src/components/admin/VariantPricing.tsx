"use client";

export type VariantRow = { price: string; in_stock: boolean };
export type VariantMap = Record<string, VariantRow>;

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#fff", border: "1px solid #e8e8e4", borderRadius: 8,
  padding: "8px 10px", color: "#0a0a0a", fontSize: 12.5, outline: "none", boxSizing: "border-box",
};

/** One row per color already entered above — optionally set a price
 *  override and stock for that color. Leave price blank to keep using the
 *  item's base price for that color. */
export default function VariantPricing({
  colors,
  value,
  onChange,
  basePlaceholder,
}: {
  colors: string[];
  value: VariantMap;
  onChange: (v: VariantMap) => void;
  basePlaceholder: string;
}) {
  if (colors.length === 0) {
    return <p style={{ color: "#bbb", fontSize: 12, margin: 0 }}>Add colors above to set per-color pricing.</p>;
  }

  const set = (color: string, patch: Partial<VariantRow>) => {
    const current = value[color] ?? { price: "", in_stock: true };
    onChange({ ...value, [color]: { ...current, ...patch } });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {colors.map((color) => {
        const row = value[color] ?? { price: "", in_stock: true };
        return (
          <div key={color} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 100, flexShrink: 0, fontSize: 12.5, color: "#333", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {color}
            </span>
            <input
              type="number"
              min="0"
              value={row.price}
              onChange={(e) => set(color, { price: e.target.value })}
              placeholder={basePlaceholder}
              style={{ ...inputStyle, flex: 1 }}
            />
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666", whiteSpace: "nowrap", flexShrink: 0 }}>
              <input type="checkbox" checked={row.in_stock} onChange={(e) => set(color, { in_stock: e.target.checked })} />
              In stock
            </label>
          </div>
        );
      })}
    </div>
  );
}
