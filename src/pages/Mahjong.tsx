import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, RotateCcw, Shuffle, Sparkles, Timer, Undo2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { usePageSEO } from '@/hooks/usePageSEO';
import { TileArt, faceLabel } from '@/components/games/MahjongTile';
import { TableActivity } from '@/components/games/TableActivity';
import { LAYOUT_COLS, LAYOUT_ROWS, Tile, countOpenPairs, findHint, isFree, newBoard, reshuffle } from '@/lib/mahjong';
import { cn } from '@/lib/utils';

const BEST_KEY = 'miytube:mahjong-best-seconds';
const DEPTH_CQW = 0.95; // how far each layer lifts up-left; matches the tile edge in .mj-tile
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const cellStyle = (t: Tile, zIndex: number): React.CSSProperties => ({
  left: `calc(${(t.x / LAYOUT_COLS) * 100}% - ${t.z * DEPTH_CQW}cqw)`,
  top: `calc(${(t.y / LAYOUT_ROWS) * 100}% - ${t.z * DEPTH_CQW}cqw)`,
  width: `${100 / LAYOUT_COLS}%`,
  height: `${100 / LAYOUT_ROWS}%`,
  zIndex,
});

const Stat: React.FC<{ label: string; value: React.ReactNode; className?: string; testId?: string }> = ({ label, value, className, testId }) => (
  <div className={cn('min-w-[4.5rem] rounded-xl border border-gold/40 bg-mj-night/60 px-3 py-1.5 text-center', className)}>
    <div className="text-base font-semibold uppercase text-gold">{label}</div>
    <div className="font-serif text-2xl font-bold leading-tight" data-testid={testId}>
      {value}
    </div>
  </div>
);

const Booster: React.FC<{ label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }> = ({ label, onClick, disabled, children }) => (
  <div className="flex flex-col items-center gap-1.5">
    <Button variant="ghost" type="button" className="mj-booster p-0 text-base hover:bg-transparent hover:text-gold-foreground [&_svg]:size-7" onClick={onClick} disabled={disabled} aria-label={label}>
      {children}
    </Button>
    <span className="text-base font-semibold text-felt-foreground">{label}</span>
  </div>
);

const Mahjong = () => {
  usePageSEO({
    title: 'Mahjong — free tile matching | MiyTube Gaming Room',
    description: 'Play Mahjong solitaire free on MiyTube. Big, easy-to-read tiles — match pairs of free tiles to clear the board. Every board can be cleared.',
    path: '/game-room/mahjong',
  });

  const [tiles, setTiles] = useState<Tile[]>(() => newBoard().tiles);
  const [history, setHistory] = useState<Tile[][]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [hint, setHint] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [vanishing, setVanishing] = useState<Tile[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [best, setBest] = useState<number | null>(() => {
    const v = Number(typeof window !== 'undefined' ? window.localStorage.getItem(BEST_KEY) : NaN);
    return Number.isFinite(v) && v > 0 ? v : null;
  });
  const timers = useRef<number[]>([]);

  const won = tiles.length === 0;
  const freeKeys = useMemo(() => new Set(tiles.filter((t) => isFree(t, tiles)).map((t) => t.key)), [tiles]);
  const openPairs = useMemo(() => countOpenPairs(tiles), [tiles]);
  const stuck = !won && openPairs === 0;

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

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
      const gone = [other, t];
      setVanishing((v) => [...v, ...gone]);
      later(() => setVanishing((v) => v.filter((x) => !gone.includes(x))), 400);
    } else {
      setWrong(selected);
      later(() => setWrong(null), 380);
      setSelected(t.key);
    }
  };

  const restart = useCallback(() => {
    setTiles(newBoard().tiles);
    setHistory([]);
    setSelected(null);
    setHint([]);
    setVanishing([]);
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
      <div className="game-page mx-auto max-w-6xl px-3 py-5 sm:px-4">
        <Link to="/game-room" className="mb-3 inline-flex items-center gap-1 text-base text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Gaming Room
        </Link>

        <TableActivity />
        <section className="mj-board overflow-hidden rounded-[2rem] px-2 pb-6 pt-5 text-felt-foreground sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gold sm:text-4xl">
                Mahjong <span className="text-felt-foreground">麻將</span>
              </h1>
              <p className="text-base uppercase text-felt-foreground">Match two free tiles · Free to play</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Stat label="Tiles" value={tiles.length} testId="tiles-left" />
              <Stat label="Pairs open" value={openPairs} testId="pairs-open" />
              <Stat label="Time" value={<span className="inline-flex items-center gap-1"><Timer size={14} className="text-gold" />{fmt(seconds)}</span>} />
              {best !== null && <Stat label="Best" value={fmt(best)} className="hidden sm:block" />}
            </div>
          </div>

          <div
            className="relative mx-auto mt-6 [container-type:inline-size]"
            style={{ width: 'min(100%, 880px, calc(100svh - 250px))', minWidth: 'min(100%, 340px)' }}
          >
            <div className="relative w-full" style={{ aspectRatio: `${LAYOUT_COLS * 3} / ${LAYOUT_ROWS * 4}` }}>
              {tiles.map((t) => {
                const free = freeKeys.has(t.key);
                const isSel = selected === t.key;
                return (
                  <Button
                    variant="ghost"
                    key={t.key}
                    type="button"
                    onClick={() => click(t)}
                    aria-label={`${faceLabel(t.face)}${free ? '' : ', blocked'}`}
                    aria-pressed={isSel}
                    className={cn('absolute h-auto rounded-none bg-transparent p-0 text-base outline-none hover:bg-transparent', free ? 'cursor-pointer' : 'cursor-default')}
                    style={cellStyle(t, t.z * 10 + (isSel ? 5 : 1))}
                  >
                    <div
                      className="mj-tile flex items-center justify-center"
                      data-free={free}
                      data-selected={isSel}
                      data-hint={hint.includes(t.key)}
                      data-wrong={wrong === t.key}
                    >
                      <TileArt face={t.face} />
                    </div>
                  </Button>
                );
              })}

              {vanishing.map((t) => (
                <div key={`v${t.key}`} className="absolute" style={cellStyle(t, t.z * 10 + 6)} aria-hidden="true">
                  <div className="mj-tile mj-tile-vanish flex items-center justify-center" data-selected="true">
                    <TileArt face={t.face} />
                  </div>
                </div>
              ))}

              {(won || stuck) && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
                  <div className="flex max-w-full flex-col items-center gap-3 rounded-lg border border-gold/60 bg-mj-night/90 px-3 py-4 text-center shadow-2xl animate-in fade-in zoom-in-95 sm:px-8 sm:py-6" aria-live="polite">
                    {won ? (
                      <>
                        <Sparkles className="h-10 w-10 text-gold" />
                        <p className="font-serif text-3xl font-bold text-gold">Board cleared!</p>
                        <p className="text-felt-foreground">
                          Time {fmt(seconds)}
                          {best === seconds ? ' · New best' : ''}
                        </p>
                        <Button data-game-command onClick={restart} size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                          Play again
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="font-serif text-2xl font-bold text-gold">No matches left</p>
                        <p className="text-base text-felt-foreground">Shuffle the tiles still on the board to keep going.</p>
                        <Button data-game-command onClick={doShuffle} size="lg" className="gap-2 bg-gold text-gold-foreground hover:bg-gold/90">
                          <Shuffle size={18} /> Shuffle
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mx-auto mt-7 flex max-w-md items-end justify-center gap-3 sm:gap-10">
            <Booster label="Hint" onClick={showHint} disabled={won || stuck}>
              <Lightbulb size={26} />
            </Booster>
            <Booster label="Shuffle" onClick={doShuffle} disabled={won}>
              <Shuffle size={26} />
            </Booster>
            <Booster label="Undo" onClick={undo} disabled={!history.length}>
              <Undo2 size={26} />
            </Booster>
            <Booster label="New" onClick={restart}>
              <RotateCcw size={24} />
            </Booster>
          </div>
        </section>

        <div className="mt-6 rounded-xl border bg-card p-4 text-base">
          <h2 className="mb-2 font-serif text-lg font-bold">How to play</h2>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Tap two matching tiles to clear them. Bright tiles are free to take; dimmed tiles are blocked.</li>
            <li>A tile is free when nothing is on top of it and its left or right side is open.</li>
            <li>No timer pressure — every new board can be cleared. Stuck? Use Hint, Undo or Shuffle.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Mahjong;
