import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  company: z.string().trim().min(1, "Company / Project is required").max(150),
  email: z.string().trim().email("Enter a valid email").max(255),
  role: z.string().trim().max(100).optional(),
});

export const CONFIRMATION =
  "Thank you. We'll send the rate card the same day, along with a 15-minute walkthrough of your own tour run through the placement.";

export default function RateCardRequestModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", role: "" });
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    setError(null); setSending(true);
    const { error: err } = await supabase.functions.invoke("rate-card-request", { body: parsed.data });
    setSending(false);
    if (err) { setError("Something went wrong. Please email advertise@miytube.com."); return; }
    setDone(true);
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setDone(false); setError(null); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Request rate card</DialogTitle></DialogHeader>
        {done ? (
          <p className="text-sm text-muted-foreground">{CONFIRMATION}</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1"><Label htmlFor="rc-name">Name</Label><Input id="rc-name" value={form.name} onChange={set("name")} maxLength={100} /></div>
            <div className="space-y-1"><Label htmlFor="rc-company">Company / Project</Label><Input id="rc-company" value={form.company} onChange={set("company")} maxLength={150} /></div>
            <div className="space-y-1"><Label htmlFor="rc-email">Email</Label><Input id="rc-email" type="email" value={form.email} onChange={set("email")} maxLength={255} /></div>
            <div className="space-y-1"><Label htmlFor="rc-role">Role or interest (optional)</Label><Input id="rc-role" placeholder="developer, agency, other" value={form.role} onChange={set("role")} maxLength={100} /></div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={sending}>{sending ? "Sending…" : "Request rate card"}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
