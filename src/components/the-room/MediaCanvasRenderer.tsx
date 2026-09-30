export type CanvasBlockData =
  | { type: 'METRICS_GRID'; title: string; payload: { metrics: { label: string; value: string; variance?: string }[] } }
  | { type: 'COMPARISON_TABLE'; title: string; payload: { headers: string[]; rows: string[][] } }
  | { type: 'CODE_SANDBOX'; title: string; payload: { language: string; snippets: string } };

export default function MediaCanvasRenderer({ block }: { block: CanvasBlockData | null }) {
  if (!block) return null;

  return (
    <section aria-label={block.title} className="dark w-full min-w-0 rounded-md border border-border bg-card p-4 sm:p-5 mb-6 space-y-4 animate-fade-in text-card-foreground">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <h3 className="text-xs font-mono uppercase font-semibold text-primary flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          {block.title}
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground">{block.type.replaceAll('_', ' ')}</span>
      </div>

      {block.type === 'METRICS_GRID' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {block.payload.metrics.map((item, idx) => (
            <div key={idx} className="min-w-0 rounded-md border border-border bg-background p-4">
              <p className="text-[11px] font-mono uppercase text-muted-foreground break-words">{item.label}</p>
              <p className="text-xl font-bold font-mono mt-1 break-words">{item.value}</p>
              {item.variance && <p className="text-xs font-mono text-primary mt-1">{item.variance}</p>}
            </div>
          ))}
        </div>
      )}

      {block.type === 'COMPARISON_TABLE' && (
        <div className="max-w-full overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[400px] text-left text-xs">
            <thead className="bg-muted text-muted-foreground font-mono uppercase">
              <tr>{block.payload.headers.map((header, i) => <th key={i} scope="col" className="p-3 font-medium">{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {block.payload.rows.map((row, i) => (
                <tr key={i}>{block.payload.headers.map((_, j) => <td key={j} className="p-3 align-top break-words max-w-[240px]">{row[j] ?? ''}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {block.type === 'CODE_SANDBOX' && (
        <div className="overflow-hidden rounded-md border border-border bg-background">
          <p className="border-b border-border px-4 py-2 text-xs font-mono text-muted-foreground">{block.payload.language}</p>
          <pre className="max-h-[300px] overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground"><code>{block.payload.snippets}</code></pre>
        </div>
      )}
    </section>
  );
}