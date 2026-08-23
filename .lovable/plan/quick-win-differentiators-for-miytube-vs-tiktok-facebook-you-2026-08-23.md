# Quick-win differentiators for MiyTube vs. TikTok/Facebook/YouTube

Goal: Add creator monetization + content-format features that both MiyTube and IWIN can use, ship in days.

## Proposed quick wins

### 1. Creator Tip Jar (creator monetization)
- One-click "Tip this creator" button on the watch page and channel page.
- Pre-set amounts ($2 / $5 / $10) plus custom amount; paid via Stripe.
- Creator gets paid to the same Stripe account used for ad campaigns / partner program.
- Differentiator: YouTube/Facebook make fans buy subscriptions or memberships; a simple tip jar is faster and more casual.

### 2. AI Video-to-Article (content format)
- "Generate article" button for each uploaded video.
- Uses Cha/Gemini to summarize the video into a blog post with headings, key points, and a transcript excerpt.
- Publishes to the existing `/blog` system and can also render on IWIN as a static article.
- Differentiator: turns every video into searchable, SEO-friendly long-form content automatically.

### 3. Creator Playlists / Series (content format + engagement)
- Creators can group their own videos into named playlists/series.
- Series page shows episodes in order, auto-plays next episode.
- Embeddable into IWIN pages as a "5 across" grid or sidebar list.
- Differentiator: YouTube has playlists, but TikTok/Facebook don't do episode-style series well.

### 4. Paid Video Requests (creator monetization)
- Viewers can pay a creator to make a specific video topic (e.g., "$25 make a review of X").
- Creator accepts/declines; if accepted, requester is notified when the video is uploaded.
- Differentiator: direct fan-to-creator economy that YouTube/Facebook/TikTok don't offer.

## Recommended first build

Start with **Creator Tip Jar** + **AI Video-to-Article** because:
- Both reuse existing Stripe and Cha infrastructure.
- Both can be shipped in a few days.
- Both work on MiyTube and can be exposed on IWIN without heavy backend changes.

## Implementation notes

### Tip Jar
- Add `tips` table: `id`, `payer_id` (nullable), `creator_id`, `video_id`, `amount_cents`, `currency`, `stripe_payment_intent_id`, `message`, `created_at`.
- RLS: authenticated users can insert their own tips; creators can select tips they received.
- Edge Function: `create-tip-intent` creates a Stripe PaymentIntent and returns `client_secret`.
- Frontend: `<TipCreatorButton creatorId videoId />` on watch page and channel page.

### AI Video-to-Article
- Add `blog_posts.generated_from_video_id` nullable FK to `uploaded_videos`.
- Edge Function: `generate-video-article` calls Gemini 3.7 Flash with title, description, tags, and (if available) transcript.
- Frontend: "Generate article" action on the video owner menu; publishes as a draft to the existing blog editor.
- IWIN: static article HTML can embed the generated content.

### Playlists / Series
- Add `playlists` table: `id`, `creator_id`, `title`, `slug`, `description`, `created_at`.
- Add `playlist_items` table: `id`, `playlist_id`, `video_id`, `position`.
- RLS: creators manage own playlists; public read.
- Frontend: playlist creation UI, playlist page with next/previous player, embeddable list for IWIN.

## Testing plan

1. **Tip Jar**
   - On a watch page, click "Tip", choose $5, complete Stripe test card.
   - Verify `tips` row created and `stripe_payment_intent_id` populated.
   - Verify creator can see tip in their account.

2. **AI Video-to-Article**
   - Upload a video, click "Generate article".
   - Verify blog draft is created with title, summary, and embedded video.
   - Publish and confirm it appears on homepage Latest Articles.

3. **Playlists / Series**
   - Create a playlist, add 3 videos, reorder them.
   - Visit playlist page, play first video, verify auto-advance to next.
   - Embed playlist list on an IWIN page and verify links work.
