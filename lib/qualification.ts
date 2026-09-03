// Deterministic, non-AI qualification signals — computed purely from fields
// already stored on the prospect row. Never fabricates a match; anything not
// verifiable shows as "Unverified" / "Not found" instead of guessing.

export type QualificationProspect = {
  industry: string | null;
  location: string | null;
  size_source: string | null;
  decision_maker_name: string | null;
  decision_maker_email: string | null;
  company_email: string | null;
};

export type Chip = { label: string; ok: boolean | null };

export function qualificationChips(
  p: QualificationProspect,
  searched: { industry?: string; location?: string } = {}
): Chip[] {
  const chips: Chip[] = [];

  if (searched.industry) {
    const match =
      !!p.industry &&
      p.industry.toLowerCase().includes(searched.industry.toLowerCase());
    chips.push({ label: match ? "Industry Match" : "Industry: Unclear", ok: match });
  }

  if (searched.location) {
    const match =
      !!p.location &&
      p.location.toLowerCase().includes(searched.location.toLowerCase());
    chips.push({ label: match ? "Location Match" : "Location: Unclear", ok: match });
  }

  chips.push({
    label: p.size_source ? "Company Size Verified" : "Company Size: Unverified",
    ok: p.size_source ? true : null,
  });

  chips.push({
    label: p.decision_maker_name ? "Decision Maker Found" : "Decision Maker: Not Found",
    ok: !!p.decision_maker_name,
  });

  chips.push({
    label:
      p.decision_maker_email || p.company_email
        ? "Contact Email Found"
        : "Contact Email: Not Found",
    ok: !!(p.decision_maker_email || p.company_email),
  });

  return chips;
}
