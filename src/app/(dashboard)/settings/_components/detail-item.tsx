export function DetailItem({
  label,
  value,
  emptyText,
}: {
  label: string;
  value?: string | number | null;
  emptyText?: string;
}) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={
          hasValue
            ? "truncate text-sm font-medium"
            : "truncate text-sm text-muted-foreground"
        }
      >
        {hasValue ? value : (emptyText ?? "—")}
      </dd>
    </div>
  );
}
