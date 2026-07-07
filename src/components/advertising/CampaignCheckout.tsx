import { useCallback } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

interface CampaignCheckoutProps {
  campaignId: string;
  /** Fixed tier price id (e.g. 'ad_starter_10'). Omit when using customAmountCents. */
  priceId?: string;
  /** Custom budget in cents. Ignored if priceId provided. */
  customAmountCents?: number;
  /** 'initial' → create-ad-checkout; 'topup' → topup-ad-checkout */
  mode: "initial" | "topup";
  returnUrl?: string;
}

export function CampaignCheckout({
  campaignId,
  priceId,
  customAmountCents,
  mode,
  returnUrl,
}: CampaignCheckoutProps) {
  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const fn = mode === "topup" ? "topup-ad-checkout" : "create-ad-checkout";
    const body: Record<string, unknown> = {
      campaignId,
      returnUrl:
        returnUrl ??
        `${window.location.origin}/advertising/checkout-return?session_id={CHECKOUT_SESSION_ID}`,
      environment: getStripeEnvironment(),
    };
    if (mode === "topup") {
      body.amountCents = customAmountCents;
    } else if (priceId) {
      body.priceId = priceId;
    } else if (customAmountCents) {
      body.customAmountCents = customAmountCents;
    }

    const { data, error } = await supabase.functions.invoke(fn, { body });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || data?.error || "Failed to start checkout");
    }
    return data.clientSecret;
  }, [campaignId, priceId, customAmountCents, mode, returnUrl]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
