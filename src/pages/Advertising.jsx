import { useState } from "react";

export default function Advertising() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ padding: "20px", fontFamily: "'Poppins', sans-serif" }}>
      <h1 style={{ marginBottom: "10px" }}>MiyTube Advertising</h1>
      <p style={{ marginBottom: "25px", opacity: 0.8 }}>
        Property tour video placements for real estate developers.
      </p>

      {/* TABS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "25px", flexWrap: "wrap" }}>
        {["overview", "inventory", "create", "campaigns"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: tab === t ? "#d00000" : "white",
              color: tab === t ? "white" : "black",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            {t === "overview" && "Overview"}
            {t === "inventory" && "Inventory & Pricing"}
            {t === "create" && "Create Campaign"}
            {t === "campaigns" && "My Campaigns"}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div>
          <h2>Advertise on MiyTube</h2>
          <p style={{ marginBottom: "20px", lineHeight: "1.6", maxWidth: "70ch" }}>
            MiyTube places property tour video as the content, not as a pre-roll slot
            competing with seven others. A viewer chooses to watch your tour, and we
            report what happened: how many started it, how many finished it, and how
            many went on to a listing or a booked viewing.
          </p>

          {/* AUDIENCE — the only figures we publish */}
          <div
            style={{
              padding: "20px",
              borderRadius: "12px",
              background: "rgba(0,0,0,0.05)",
              marginBottom: "30px"
            }}
          >
            <h3 style={{ marginBottom: "6px" }}>Audience</h3>
            <p style={{ opacity: 0.7, fontSize: "14px", marginBottom: "16px" }}>
              GA4, Miytube Video Sharing · Sep 17 – Oct 14, 2026 (28 days)
            </p>
            <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
              <Figure value="93,000" label="30-day active users" />
              <Figure value="24,000" label="Weekly active" />
              <Figure value="86,000" label="First-time visits" />
              <Figure value="31,000" label="Video views" />
              <Figure value="33,000" label="Watch-page views" />
              <Figure value="25,000" label="Search-box interactions" />
            </div>
            <p style={{ opacity: 0.7, fontSize: "13px", marginTop: "16px" }}>
              These are the only audience figures we publish. We do not describe this
              audience as accredited investors, financially literate, or high-net-worth —
              GA4 does not support any of those claims.
            </p>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Step
              number="1"
              title="Create Your Campaign"
              text="Choose the placement, the tour footage and the geography. We agree placement in writing before anything runs."
            />
            <Step
              number="2"
              title="Fund & Launch"
              text="Campaigns are funded in USDC. Paying in USDC takes 15% off rate card, applied as a separate line."
            />
            <Step
              number="3"
              title="Report & Review"
              text="You receive starts, completions, watch-through and downstream actions on the cadence you pick. We do not promise a real-time dashboard."
            />
          </div>
        </div>
      )}

      {/* INVENTORY & PRICING */}
      {tab === "inventory" && (
        <div>
          <h2>Inventory &amp; Pricing</h2>
          <p style={{ marginBottom: "25px", lineHeight: "1.6", maxWidth: "70ch" }}>
            Inventory is sold on CPM and CPC against a one-page rate card. We do not
            publish a number here, and we will not improvise one in a meeting — request
            the rate card and we'll send it shortly.
          </p>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
            <div
              style={{
                flex: "1",
                minWidth: "280px",
                padding: "22px",
                borderRadius: "12px",
                border: "1px solid #ccc"
              }}
            >
              <h3>Rate card</h3>
              <p style={{ opacity: 0.8, lineHeight: "1.6" }}>
                CPM and CPC, one page. Placement, duration and targeting options are
                listed on it.
              </p>
              <button
                style={{
                  padding: "12px 20px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Request rate card
              </button>
            </div>

            <div
              style={{
                flex: "1",
                minWidth: "280px",
                padding: "22px",
                borderRadius: "12px",
                border: "1px solid #ccc",
                background: "rgba(0,123,255,0.05)"
              }}
            >
              <h3>15% USDC discount</h3>
              <p style={{ opacity: 0.8, lineHeight: "1.6" }}>
                Pay in USDC instead of fiat and you get 15% off rate card, applied as a
                separate line. It saves budget and settles in seconds instead of days —
                no wire fees, no cross-border holds.
              </p>
              <p
                style={{
                  opacity: 0.7,
                  fontSize: "13px",
                  borderTop: "1px solid #ddd",
                  paddingTop: "12px"
                }}
              >
                The discount is for paying in USDC. It is not a discount for paying in
                WFC2, and it cannot be — a security token cannot be the platform's
                spending currency.
              </p>
            </div>
          </div>

          <h3 style={{ marginBottom: "12px" }}>What we sell</h3>

          <Format
            title="Property tour placement"
            status="Available"
            desc="Your tour surfaced where a viewer arrives deliberately — the Watch page and relevant search results. Placement is agreed in writing before the campaign starts, not 'in the feed'."
          />
          <Format
            title="Staked viewing deposit"
            status="Lead product"
            desc="A buyer stakes a deposit to book a viewing of your property. Refunded if they attend, forfeited if they don't. It filters casual browsers from serious intent, so the traffic your tour produces is committed, no-show-filtered buyer intent rather than clicks."
          />
          <Format
            title="Viewer completion credits"
            status="Available"
            desc="Your campaign funds a reward pool. A viewer who completes your tour is credited to their platform balance in platform credits, redeemable against services and fees inside the real estate marketplace. Ad fees and viewer rewards run in USDC and platform credits — never in WFC2."
          />

          <div
            style={{
              marginTop: "20px",
              padding: "18px 20px",
              borderRadius: "10px",
              borderLeft: "3px solid #d00000",
              background: "rgba(208,0,0,0.05)"
            }}
          >
            <strong>No completion rate is published.</strong>
            <p style={{ opacity: 0.8, marginTop: "6px", lineHeight: "1.6" }}>
              We have no campaign data yet. When we do, we will quote the real number and
              the sample it came from.
            </p>
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN — flow kept, pricing select removed */}
      {tab === "create" && (
        <div>
          <h2>Create Campaign</h2>
          <p style={{ opacity: 0.8, marginBottom: "10px", lineHeight: "1.6" }}>
            Tell us what you want to run. We will come back with placement, the rate
            card, and a launch window.
          </p>

          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "500px",
              marginTop: "20px"
            }}
          >
            <input type="text" placeholder="Campaign Name" style={inputStyle} />
            <input type="text" placeholder="Business Name" style={inputStyle} />
            <input type="text" placeholder="Business Website" style={inputStyle} />
            <input type="text" placeholder="Project / Development Name" style={inputStyle} />
            <input type="text" placeholder="Target Geography" style={inputStyle} />

            <h3>Placement</h3>

            <select style={inputStyle} defaultValue="tour">
              <option value="tour">Property tour placement</option>
              <option value="deposit">Staked viewing deposit campaign</option>
              <option value="credits">Viewer completion credits</option>
            </select>

            <p style={{ opacity: 0.7, fontSize: "13px" }}>
              Rate card and total cost are confirmed by our team before anything runs.
            </p>

            <button
              type="button"
              style={{
                padding: "12px",
                background: "#d00000",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Submit Campaign Brief
            </button>
          </form>
        </div>
      )}

      {/* CAMPAIGNS */}
      {tab === "campaigns" && (
        <div>
          <h2>My Campaigns</h2>
          <p style={{ opacity: 0.6, marginTop: "10px" }}>
            You have no campaigns yet.
          </p>
        </div>
      )}
    </div>
  );
}

function Figure({ value, label }) {
  return (
    <div style={{ minWidth: "120px" }}>
      <div style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div style={{ opacity: 0.75, fontSize: "14px" }}>{label}</div>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div
      style={{
        flex: "1",
        minWidth: "250px",
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(0,0,0,0.05)"
      }}
    >
      <h3>
        {number}. {title}
      </h3>
      <p style={{ opacity: 0.8, lineHeight: "1.6" }}>{text}</p>
    </div>
  );
}

function Format({ title, status, desc }) {
  return (
    <div
      style={{
        padding: "15px",
        borderRadius: "10px",
        background: "rgba(0,0,0,0.05)",
        marginBottom: "15px"
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "baseline",
          flexWrap: "wrap"
        }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span
          style={{
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: "5px",
            background: status === "Lead product" ? "#d00000" : "rgba(0,0,0,0.08)",
            color: status === "Lead product" ? "white" : "#333"
          }}
        >
          {status}
        </span>
      </div>
      <p style={{ opacity: 0.8, marginTop: "8px", lineHeight: "1.6" }}>{desc}</p>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "15px"
};
