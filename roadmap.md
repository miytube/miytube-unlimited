## Gaming table readability
- [ ] Enlarge text, card values, wagers and action controls across all seven tables without changing game rules.
- [ ] Verify real play, contrast and unclipped layouts on desktop and phone.

## Lucky 9
- [x] Add secure 10–500 coin bets, two-card natural 8/9, one optional draw, banker draws on 0–5, even-money wins and returned ties.
- [x] Add casino table, lobby link, hand history, refresh resume and admin analytics; frontend awaits publishing.
- [x] Verify 79 card-game regression tests and 6 hosted Lucky 9 checks; real test-member draw/stand, natural/win/tie/loss, hidden-card denial, concurrent settlement, exact coin ledger and reload history passed. Admin shows 16 rounds; settled cards fit 320/390/768/1800px screens. No owner's coins spent.

## Championship poker tournament
- [x] Build six-seat Sit & Go with secure hidden cards, five bots, four betting streets, side pots, rising blinds and refresh resume.
- [x] Add championship table, lobby entry, hand results and tournament standings; frontend awaits publishing.
- [x] Verify rules and security: 56 card-game tests, 400 full-tournament stress runs, real signed-in championship win, saved 60,000-chip result and unchanged coin wallet; table fits 320/390/768/1800px screens. Existing global header overflow at 320px is outside this tournament change.
- [x] Tournament entry confirmed free by the user: 10,000 chips per seat, no wallet charges or coin prizes.

- [x] Add optional structured media canvas output to The Room's AI host.
- [x] Render and verify the canvas in the live room, resetting it when a new room begins.
- [x] Integrate the uploaded Room studio layout and launch/reply/wrap-up flow without simulated recordings or canned host replies.
- [ ] Activate the HeyGen live avatar in The Room — blocked on the user providing a HeyGen API key (add as HEYGEN_API_KEY secret); integration is built and falls back to text-only until then.
- The Room Premium: $9.99/mo Stripe subscription (room_premium_monthly) unlocks the live HeyGen avatar; free tier uses browser voice. Avatar also blocked on HEYGEN_API_KEY.
- [x] Upgrade Maya's free voice to ElevenLabs TTS (the-room-voice edge function; 503 voice_not_configured → browser voice fallback). Blocked on user adding ELEVENLABS_API_KEY (ElevenLabs connector or secret) — falls back to browser voice until then.
- [x] Podcasts promoted to its own main category (custom_categories row, site miytube) at /c/podcasts, showing the 367 videos already filed under News → Podcasts; sidebar entry added under Entertainment & Media; old /podcasts shell and its dead subject links now redirect to /c/podcasts; /news/podcasts and /podcasts/news, /podcasts/gossip left working.
- [x] First Podcasts subject pages created: News & Politics (/c/podcasts/news-podcasts, 32 videos) and Sports (/c/podcasts/sports-news-podcasts, 17 videos); both appear under Podcasts in the sidebar and fill from existing video labels without re-tagging anything.
- [x] Published the pending batch to miytube.com: Podcasts main category + redirects, Shorts Feed (swipe-up, view counter), MiyTube At Cha → Shorts Feed nav swap, home strip (Podcasts out, Shorts Feed in; At Cha → The Room), Loom-to-MP4 converter.
- [ ] User to build subject watchpages under Podcasts in the admin panel (e.g. Sports, News, Comedy, Interviews).
- [x] Shorts Feed opens at the short a visitor clicked or was sent (?v=<id>), and Share copies that link; published and verified live on miytube.com (link jumped to the right short).
- [x] Fixed the Shorts Feed view counter always reading 0: the app names videos by local_id but get_video_view_counts matched only the UUID; the function now matches both (migration 0002). Live on miytube.com with no republish needed.
- [x] Correct double-counted totals and unify video displays across Home, categories, watch pages, search, Shorts, and featured music; tests passed and Atlanta Teacher verified at 9 on Home/Crime, then 10 on both after exactly one watch. Frontend changes await publishing.
- [x] Complete Google Search Console setup: account META tag live, 375 sitemap page URLs corrected to miytube.com, published, ownership verified as siteOwner, property added, and https://miytube.com/sitemap.xml submitted successfully.

- [x] MiyTube Shop (/shop): free MiyTube Coins (500 join bonus, 50 daily), 3 kiosks, 23 items, buy + one-tap wear; Avatar Studio links to the shop.
- [x] MiyTube Shop coin packs: $4.99/500, $9.99/1,200, $19.99/3,000 by card; test purchase credited 500 coins once.

- [x] Booksem 50% Off Pass: 250 coins in the Shop, half-price checkout for Booksem audiobooks, book unlocks on the member's Booksem account; signup form promotes it. Tested end to end with a test payment.
- [ ] Booksem button "Use my MiyTube pass" — waiting on the user to put the prepared App.jsx into the Booksem repo (separate app, can't be changed from here).
- [ ] Live Booksem pass checkouts need the Stripe head office address (same blocker as live coin packs).

- [x] Gaming Room (/game-room) with Blackjack for MiyTube Coins; poker, Sic Bo, Pai Gow, Mahjong, golf, bowling shown as coming soon. Tested with a test member.
- [x] Gaming Room: Sic Bo (Chinese dice) table.
- [x] Gaming Room: Texas Hold'em table.
- [x] Gaming Room: Mahjong table.
- [x] Gaming Room: Pai Gow table (Pai Gow Poker).
- [ ] Gaming Room: Mini Golf and Bowling — waiting on the user to say when to start.
- [x] Casino look for card tables: leather rail + felt, illustrated cards with deal/flip, clay chips and bet circles on Blackjack and Hold'em (Pai Gow gets the rail, cards and chips).
- [x] Mahjong restyled after Vita Mahjong: big 3D ivory tiles, dimmed blocked tiles, starry emerald board, round Hint/Shuffle/Undo/New buttons, open-pairs counter.
- [x] Blackjack Split: split a same-rank pair into two hands (one split, split aces one card each, double after split).
- [ ] Casino look for Sic Bo (3D dice, shaker); table sounds — waiting on the user to say go.
- [x] Gaming Room admin analytics: admin-only rounds, players, table popularity, visits, wagers/returns/net flow, and Today/7-day/30-day/all-time filters; real totals checked on desktop and phone, access denied for guests and ordinary members; 101 tests passed.

## Legends search upgrade
- [x] Add accurate legend titles, descriptions, canonical URLs, athlete/collection and breadcrumb structured data, matching only the visible videos; all 27 routes checked in the preview, with page transitions and pagination verified. Frontend awaits publishing.
- [x] Correct individual video structured data to use real thumbnails, upload dates, durations and playable sources; verified the Caitlin Clark documentary source and 21:43 playback.
- [x] Include the hub and all 27 legends in the sitemap from the shared roster; live dynamic sitemap verified, 12,506 video links use real destinations, and the submitted static sitemap copy awaits publishing.

## Done
- [x] Expand the existing Shop into MiyTube Mall with real avatar-gear storefronts and Booksem, preserving coin purchases and one-tap wear; creator merchandise remains coming soon, with no invented listings. Awaiting publishing.
- [x] Verify Mall navigation, storefront filtering, and member shopping on desktop and phone; 21 tests passed, test member bought/wore/removed gear and redeemed a Booksem pass, both persisted on reload without spending the owner's coins.
- [x] Add Debate under Government & Politics, its watchpage, and matching upload choices; category isolation tests passed. Awaiting publishing.
- [x] College football watchpage fix: /sports/college/* now matches category college-sports + child subcategory; 201 regular-season games on College Football, CFP/championships moved to new /sports/college/cfp page (sidebar link added), 2 mislabeled bowl games recategorized to football-bowl-games. Verified via Playwright, build OK. Not yet published.
