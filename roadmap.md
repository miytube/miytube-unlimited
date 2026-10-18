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

## Done
- [x] College football watchpage fix: /sports/college/* now matches category college-sports + child subcategory; 201 regular-season games on College Football, CFP/championships moved to new /sports/college/cfp page (sidebar link added), 2 mislabeled bowl games recategorized to football-bowl-games. Verified via Playwright, build OK. Not yet published.
