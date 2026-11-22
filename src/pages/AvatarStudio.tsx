import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Save, Shuffle, RotateCcw, Sparkles, ExternalLink, Check, Lock } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePageSEO } from '@/hooks/usePageSEO';
import { supabase } from '@/integrations/supabase/client';
import { AvatarFigure } from '@/components/avatar/AvatarFigure';
import { setCachedAvatar, useAvatarCatalog } from '@/hooks/useAvatars';
import { SPORTS_LEGENDS } from '@/data/sportsBeginEndLegends';
import {
  AVATAR_SLOTS,
  AvatarConfig,
  AvatarEquipped,
  AvatarItem,
  AvatarSlot,
  BACKDROPS,
  DEFAULT_AVATAR_CONFIG,
  EXPRESSIONS,
  EYE_COLORS,
  HAIR_COLORS,
  HAIR_STYLES,
  Rarity,
  SHIRT_COLORS,
  SKIN_TONES,
  SLOT_LABELS,
  resolveEquippedItems,
  sanitizeAvatarConfig,
  sanitizeEquipped,
  toggleEquip,
} from '@/lib/avatar';
import { cn } from '@/lib/utils';

const RARITY_CLASS: Record<Rarity, string> = {
  common: 'border-rarity-common text-rarity-common',
  rare: 'border-rarity-rare text-rarity-rare',
  epic: 'border-rarity-epic text-rarity-epic',
  legendary: 'border-rarity-legendary text-rarity-legendary',
};

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

const AvatarStudio = () => {
  usePageSEO({
    title: 'Avatar Studio — Build your MiyTube character | MiyTube',
    description:
      'Create your MiyTube avatar. Pick your look, rep legend jerseys and gear, and show your character next to every comment.',
    path: '/avatar',
  });

  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const catalog = useAvatarCatalog();

  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [equipped, setEquipped] = useState<AvatarEquipped>({});
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [ownedSkus, setOwnedSkus] = useState<Set<string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load the member's closet (claiming the free starter pack) and saved avatar.
  useEffect(() => {
    if (authLoading || !catalog) return;
    let alive = true;
    (async () => {
      if (!user) {
        setOwnedSkus(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data: claimed } = await supabase.rpc('claim_starter_avatar_items');
      const [{ data: inv }, { data: saved }] = await Promise.all([
        supabase.from('user_avatar_inventory').select('item_id').eq('user_id', user.id),
        supabase.from('user_avatars').select('config, equipped').eq('user_id', user.id).maybeSingle(),
      ]);
      if (!alive) return;
      const ownedIds = new Set((inv ?? []).map((r) => r.item_id));
      const owned = Array.from(catalog.values()).filter((i) => ownedIds.has(i.id));
      setOwnedSkus(new Set(owned.map((i) => i.sku)));
      const nextConfig = sanitizeAvatarConfig(saved?.config);
      const nextEquipped = sanitizeEquipped(saved?.equipped, owned);
      setConfig(nextConfig);
      setEquipped(nextEquipped);
      setSavedSnapshot(saved ? JSON.stringify({ c: nextConfig, e: nextEquipped }) : '');
      setLoading(false);
      if (typeof claimed === 'number' && claimed > 0) {
        toast({ title: 'Starter pack unlocked', description: `${claimed} free items were added to your closet.` });
      }
    })();
    return () => {
      alive = false;
    };
  }, [user, authLoading, catalog, toast]);

  const allItems = useMemo(() => (catalog ? Array.from(catalog.values()) : []), [catalog]);
  // Signed-out visitors can try on the free starter pack before joining.
  const wearable = useMemo(
    () => allItems.filter((i) => (ownedSkus ? ownedSkus.has(i.sku) : i.is_starter)),
    [allItems, ownedSkus],
  );
  const itemsBySlot = useMemo(() => {
    const groups: Partial<Record<AvatarSlot, AvatarItem[]>> = {};
    // Gear the member can wear comes first; shop gear they don't own follows.
    const canWear = (i: AvatarItem) => (ownedSkus ? ownedSkus.has(i.sku) : i.is_starter);
    [...allItems]
      .sort((a, b) => Number(canWear(b)) - Number(canWear(a)) || a.sort_order - b.sort_order)
      .forEach((item) => {
        (groups[item.slot] ??= []).push(item);
      });
    return groups;
  }, [allItems, ownedSkus]);

  const resolved = catalog ? resolveEquippedItems(equipped, catalog) : {};
  const isDirty = JSON.stringify({ c: config, e: equipped }) !== savedSnapshot;

  const update = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const randomize = () =>
    setConfig({
      skin: pick(SKIN_TONES).id,
      hair: pick(HAIR_STYLES).id,
      hairColor: pick(HAIR_COLORS).id,
      eyes: pick(EYE_COLORS).id,
      expression: pick(EXPRESSIONS).id,
      shirtColor: pick(SHIRT_COLORS).id,
      backdrop: pick(BACKDROPS).id,
    });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const cleanEquipped = sanitizeEquipped(equipped, wearable);
    const { error } = await supabase
      .from('user_avatars')
      .upsert({ user_id: user.id, config: { ...config }, equipped: { ...cleanEquipped } }, { onConflict: 'user_id' });
    setSaving(false);
    if (error) {
      toast({ title: 'Could not save your avatar', description: error.message, variant: 'destructive' });
      return;
    }
    setEquipped(cleanEquipped);
    setSavedSnapshot(JSON.stringify({ c: config, e: cleanEquipped }));
    setCachedAvatar(user.id, { config, equipped: cleanEquipped });
    toast({ title: 'Avatar saved', description: 'Your character now shows on your comments and account menu.' });
  };

  if (authLoading || !catalog || loading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <header className="space-y-1">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="h-4 w-4" /> MiyTube Passport
          </p>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">Avatar Studio</h1>
          <p className="max-w-2xl text-muted-foreground">
            Build your character, rep your legends, and carry it across MiyTube — next to every comment you post.
          </p>
        </header>

        {!user && (
          <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              <span className="font-semibold">Free starter pack:</span> sign in to claim 8 items, including legend jerseys and
              boxing gloves, and save your avatar.
            </p>
            <Button asChild size="sm">
              <Link to="/auth">Sign in to claim</Link>
            </Button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          {/* Stage */}
          <section className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl bg-studio-stage p-5 text-primary-foreground shadow-xl">
              <div className="aspect-square overflow-hidden rounded-xl ring-1 ring-primary-foreground/10">
                <AvatarFigure config={config} items={resolved} className="h-full w-full" title="Your avatar" />
              </div>
              <div className="mt-4 flex min-h-7 flex-wrap gap-2">
                {Object.values(resolved).length === 0 ? (
                  <span className="text-sm text-primary-foreground/60">No gear on yet — open the Gear tab.</span>
                ) : (
                  Object.values(resolved).map((item) => (
                    <span key={item!.sku} className="rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
                      {item!.name}
                    </span>
                  ))
                )}
              </div>
              <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
                {user ? (
                  <Button onClick={handleSave} disabled={saving || !isDirty} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : isDirty ? <Save className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    {saving ? 'Saving…' : isDirty ? 'Save avatar' : 'Saved'}
                  </Button>
                ) : (
                  <Button asChild className="gap-2">
                    <Link to="/auth">
                      <Lock className="h-4 w-4" /> Sign in to save
                    </Link>
                  </Button>
                )}
                <Button variant="secondary" size="icon" onClick={randomize} aria-label="Random look" title="Random look">
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="Start over"
                  title="Start over"
                  onClick={() => {
                    setConfig(DEFAULT_AVATAR_CONFIG);
                    setEquipped({});
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Controls */}
          <section>
            <Tabs defaultValue="look">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="look">Look</TabsTrigger>
                <TabsTrigger value="gear">Gear</TabsTrigger>
                <TabsTrigger value="backdrop">Backdrop</TabsTrigger>
              </TabsList>

              <TabsContent value="look" className="space-y-6 pt-4">
                <SwatchRow label="Skin tone" options={SKIN_TONES} value={config.skin} onChange={(v) => update('skin', v)} />
                <ChipRow label="Hair" options={HAIR_STYLES} value={config.hair} onChange={(v) => update('hair', v)} />
                <SwatchRow label="Hair color" options={HAIR_COLORS} value={config.hairColor} onChange={(v) => update('hairColor', v)} />
                <SwatchRow label="Eyes" options={EYE_COLORS} value={config.eyes} onChange={(v) => update('eyes', v)} />
                <ChipRow label="Expression" options={EXPRESSIONS} value={config.expression} onChange={(v) => update('expression', v)} />
                <SwatchRow
                  label="Shirt (when no top is worn)"
                  options={SHIRT_COLORS}
                  value={config.shirtColor}
                  onChange={(v) => update('shirtColor', v)}
                />
              </TabsContent>

              <TabsContent value="gear" className="space-y-8 pt-4">
                {AVATAR_SLOTS.filter((s) => s !== 'background' && itemsBySlot[s]?.length).map((slot) => (
                  <div key={slot} className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{SLOT_LABELS[slot]}</h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                      {itemsBySlot[slot]!.map((item) => (
                        <GearCard
                          key={item.sku}
                          item={item}
                          config={config}
                          equipped={equipped}
                          catalog={catalog}
                          canWear={wearable.some((w) => w.sku === item.sku)}
                          onToggle={() => setEquipped((prev) => toggleEquip(prev, item))}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  Want more? Legend jerseys, fight gear and gold drops are in the{' '}
                  <Link to="/shop" className="font-medium text-primary hover:underline">
                    MiyTube Shop
                  </Link>
                  . Every item has its own permanent item code, ready to move to a crypto wallet later.
                </p>
              </TabsContent>

              <TabsContent value="backdrop" className="space-y-6 pt-4">
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Free backdrops</h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {BACKDROPS.map((b) => {
                      const active = !equipped.background && config.backdrop === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            update('backdrop', b.id);
                            setEquipped((prev) => {
                              const next = { ...prev };
                              delete next.background;
                              return next;
                            });
                          }}
                          className={cn(
                            'overflow-hidden rounded-xl border-2 text-left transition',
                            active ? 'border-primary' : 'border-transparent hover:border-border',
                          )}
                        >
                          <span className="block h-16" style={{ background: `linear-gradient(${b.from}, ${b.to})` }} />
                          <span className="block bg-card px-3 py-2 text-sm font-medium">{b.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {itemsBySlot.background?.length ? (
                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gear backdrops</h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                      {itemsBySlot.background.map((item) => (
                        <GearCard
                          key={item.sku}
                          item={item}
                          config={config}
                          equipped={equipped}
                          catalog={catalog}
                          canWear={wearable.some((w) => w.sku === item.sku)}
                          onToggle={() => setEquipped((prev) => toggleEquip(prev, item))}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </div>
    </Layout>
  );
};

interface Option {
  id: string;
  label: string;
  color?: string;
}

const SwatchRow: React.FC<{ label: string; options: readonly Option[]; value: string; onChange: (v: string) => void }> = ({
  label,
  options,
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <p className="text-sm font-semibold">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          title={o.label}
          aria-label={o.label}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            'h-10 w-10 rounded-full border-2 transition',
            value === o.id ? 'scale-110 border-primary ring-2 ring-primary/30' : 'border-border hover:scale-105',
          )}
          style={{ backgroundColor: o.color }}
        />
      ))}
    </div>
  </div>
);

const ChipRow: React.FC<{ label: string; options: readonly Option[]; value: string; onChange: (v: string) => void }> = ({
  label,
  options,
  value,
  onChange,
}) => (
  <div className="space-y-2">
    <p className="text-sm font-semibold">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Button
          key={o.id}
          type="button"
          size="sm"
          variant={value === o.id ? 'default' : 'outline'}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </Button>
      ))}
    </div>
  </div>
);

const GearCard: React.FC<{
  item: AvatarItem;
  config: AvatarConfig;
  equipped: AvatarEquipped;
  catalog: Map<string, AvatarItem>;
  canWear: boolean;
  onToggle: () => void;
}> = ({ item, config, equipped, catalog, canWear, onToggle }) => {
  const isOn = equipped[item.slot] === item.sku;
  const preview = resolveEquippedItems({ ...equipped, [item.slot]: item.sku }, catalog);
  const legend = item.legend_id ? SPORTS_LEGENDS.find((l) => l.id === item.legend_id) : undefined;
  return (
    <div className={cn('flex flex-col overflow-hidden rounded-xl border bg-card transition', isOn && 'border-primary ring-2 ring-primary/20')}>
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <AvatarFigure config={config} items={preview} className="h-full w-full" title={`Preview: ${item.name}`} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold leading-tight">{item.name}</p>
          <Badge variant="outline" className={cn('shrink-0 capitalize', RARITY_CLASS[item.rarity])}>
            {item.rarity}
          </Badge>
        </div>
        {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
        {legend && (
          <a
            href={`https://sportsbeginend.com/profile/${legend.id}?utm_source=miytube&utm_medium=avatar_studio&utm_campaign=legend_gear`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {legend.name}'s story <ExternalLink className="h-3 w-3" />
          </a>
        )}
        <p className="font-mono text-[10px] text-muted-foreground">{item.sku}</p>
        {!canWear ? (
          item.is_starter ? (
            <Button size="sm" variant="outline" className="mt-auto" disabled>
              <Lock className="mr-1 h-3 w-3" /> Locked
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline" className="mt-auto">
              <Link to="/shop">
                <Lock className="mr-1 h-3 w-3" /> Get it in the Shop · {item.price_credits.toLocaleString()} coins
              </Link>
            </Button>
          )
        ) : (
          <Button size="sm" variant={isOn ? 'secondary' : 'default'} className="mt-auto" onClick={onToggle}>
            {isOn ? 'Take off' : 'Wear'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarStudio;
