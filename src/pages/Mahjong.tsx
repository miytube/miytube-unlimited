import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, RotateCcw, Shuffle, Sparkles, Timer, Undo2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { usePageSEO } from '@/hooks/usePageSEO';
import { TileArt, faceLabel } from '@/components/games/MahjongTile';
import { LAYOUT_COLS, LAYOUT_ROWS, Tile, findHint, isFree, newBoard, reshuffle } from '@/lib/mahjong';
import { cn } from '@/lib/utils';

const BEST_KEY = 'miytube:mahjong-best-seconds';
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const Mahjong = () => {
  usePageSEO({
    title: 'Mahjong — free tile matching | MiyTube Gaming Room',
    description: 'Play Mahjong solitaire free on MiyTube. Match pairs of free tiles to clear the pyramid. Every board can be cleared.',
    path: '/game-room/mahjong',
  });

  const [tiles, setTiles] = useState<Tile[]>(() => newBoard().tiles);
  const [history, setHistory] = useState<Tile[][]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [hint, setHint] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [best, setBest] = useState<number | null>(() => {
    const v = Number(typeof window !== 'undefined' ? window.localStorage.getItem(BEST_KEY) : NaN);
    return Number.isFinite(v) && v > 0 ? v : null;
  });

  const won = tiles.length === 0;
  const freeKeys = useMemo(() => new Set(tiles.filter((t) => isFree(t, tiles)).map((t) => t.key)), [tiles]);
  const stuck = !won && !findHint(tiles);

  useEffect(() => {
    if (!started || won) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [started, won]);

  useEffect(() => {
    if (!won || !started) return;
    if (best === null || seconds < best) {
      setBest(seconds);
      window.localStorage.setItem(BEST_KEY, String(seconds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const click = (t: Tile) => {
    if (!freeKeys.has(t.key)) return;
    setStarted(true);
    setHint([]);
    if (selected === null) return setSelected(t.key);
    if (selected === t.key) return setSelected(null);
    const other = tiles.find((x) => x.key === selected);
    if (other && other.face.id === t.face.id) {
      setHistory((h) => [...h, tiles]);
      setTiles((ts) => ts.filter((x) => x.key !== t.key && x.key !== other.key));
      setSelected(null);
    } else {
      setSelected(t.key);
    }
  };

  const restart = useCallback(() => {
    setTiles(newBoard().tiles);
    setHistory([]);
    setSelected(null);
    setHint([]);
    setSeconds(0);
    setStarted(false);
  }, []);

  const showHint = () => {
    const h = findHint(tiles);
    if (h) setHint([h[0].key, h[1].key]);
  };

  const doShuffle = () => {
    setHistory((h) => [...h, tiles]);
    setTiles((ts) => reshuffle(ts));
    setSelected(null);
    setHint([]);
  };

  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h;
      setTiles(h[h.length - 1]);
      return h.slice(0, -1);
    });
    setSelected(null);
    setHint([]);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link to="/game-room" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> Gaming Room
          </Link>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
              <Timer size={15} /> {fmt(seconds)}
            </span>
            <span className="rounded-full bg-secondary px-3 py-1.5" data-testid="tiles-left">
              {tiles.length} tiles left
            </span>
            {best !== null && <span className="hidden rounded-full bg-secondary px-3 py-1.5 sm:inline">Best {fmt(best)}</span>}
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] border-4 border-gold/70 bg-table-felt px-3 py-6 text-felt-foreground shadow-2xl sm:px-8">
          <h1 className="text-center font-serif text-3xl font-bold tracking-wide">
            Mahjong <span className="text-gold">麻將</span>
          </h1>
          <p className="text-center text-xs uppercase tracking-[0.25em] text-gold">Match two free tiles · Clear the pyramid · Free to play</p>

          <div className="relative mx-auto mt-6 w-full max-w-[640px] [container-type:inline-size]">
            <div className="relative w-full" style={{ aspectRatio: `${LAYOUT_COLS * 3} / ${LAYOUT_ROWS * 4}` }}>
              {tiles.map((t) => {
                const free = freeKeys.has(t.key);
                const isSel = selected === t.key;
                const isHint = hint.includes(t.key);
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => click(t)}
                    aria-label={`${faceLabel(t.face)}${free ? '' : ', blocked'}`}
                    aria-pressed={isSel}
                    className={cn(
                      'absolute flex items-center justify-center rounded-[0.9cqw] border border-border bg-playing-card shadow-md transition-all',
                      'border-b-[0.7cqw] border-r-[0.7cqw] border-b-gold/60 border-r-gold/60',
                      free ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default brightness-[0.82]',
                      isSel && 'z-[60] -translate-y-1 ring-[0.6cqw] ring-gold',
                      isHint && 'animate-pulse ring-[0.6cqw] ring-gold',
                    )}
                    style={{
                      left: `calc(${(t.x / LAYOUT_COLS) * 100}% - ${t.z * 0.8}cqw)`,
                      top: `calc(${(t.y / LAYOUT_ROWS) * 100}% - ${t.z * 0.8}cqw)`,
                      width: `${100 / LAYOUT_COLS}%`,
                      height: `${100 / LAYOUT_ROWS}%`,
                      zIndex: isSel ? 60 : t.z * 10 + 1,
                    }}
                  >
                    <TileArt face={t.face} />
                  </button>
                );
              })}

              {won && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center animate-in fade-in zoom-in-95">
                  <Sparkles className="h-10 w-10 text-gold" />
                  <p className="font-serif text-3xl font-bold">Board cleared!</p>
                  <p className="text-felt-foreground/85">
                    Time {fmt(seconds)}
                    {best === seconds ? ' · New best' : ''}
                  </p>
                  <Button onClick={restart} className="bg-gold text-gold-foreground hover:bg-gold/90">
                    Play again
                  </Button>
                </div>
              )}
            </div>
          </div>

          {stuck && (
            <p className="mt-4 text-center text-sm font-semibold text-gold" aria-live="polite">
              No matching free tiles left. Tap Shuffle to keep going.
            </p>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3 border-t border-gold/30 pt-5">
            <Button onClick={showHint} disabled={won || stuck} className="gap-1 bg-gold text-gold-foreground hover:bg-gold/90">
              <Lightbulb size={16} /> Hint
            </Button>
            <Button
              variant="outline"
              onClick={doShuffle}
              disabled={won}
              className="gap-1 border-gold bg-transparent text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground"
            >
              <Shuffle size={16} /> Shuffle
            </Button>
            <Button
              variant="outline"
              onClick={undo}
              disabled={!history.length}
              className="gap-1 border-gold bg-transparent text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground"
            >
              <Undo2 size={16} /> Undo
            </Button>
            <Button
              variant="outline"
              onClick={restart}
              className="gap-1 border-gold bg-transparent text-felt-foreground hover:bg-felt-deep hover:text-felt-foreground"
            >
              <RotateCcw size={16} /> New board
            </Button>
          </div>
        </section>

        <div className="mt-6 rounded-xl border bg-card p-4 text-sm">
          <h2 className="mb-2 font-serif text-lg font-bold">How to play</h2>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Tap two matching tiles to clear them. Brighter tiles are free to take.</li>
            <li>A tile is free when nothing is on top of it and its left or right side is open.</li>
            <li>Every new board can be cleared. Stuck? Use Hint, Undo or Shuffle.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Mahjong;
