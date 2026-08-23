CREATE OR REPLACE FUNCTION public.guard_ad_campaign_owner_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Admins and service role bypass
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Freeze financial / moderation / metrics fields for owners
  NEW.payment_status    := OLD.payment_status;
  NEW.payment_method    := OLD.payment_method;
  NEW.payment_reference := OLD.payment_reference;
  NEW.amount_spent      := OLD.amount_spent;
  NEW.refunded_amount   := OLD.refunded_amount;
  NEW.budget_payments   := OLD.budget_payments;
  NEW.stripe_customer_id := OLD.stripe_customer_id;
  NEW.last_payment_error := OLD.last_payment_error;
  NEW.dispute_status    := OLD.dispute_status;
  NEW.impressions       := OLD.impressions;
  NEW.clicks            := OLD.clicks;
  NEW.views             := OLD.views;
  NEW.ctr               := OLD.ctr;
  NEW.cost_per_view     := OLD.cost_per_view;
  NEW.admin_notes       := OLD.admin_notes;
  NEW.rejection_reason  := OLD.rejection_reason;
  NEW.reviewed_at       := OLD.reviewed_at;
  NEW.reviewed_by       := OLD.reviewed_by;
  NEW.user_id           := OLD.user_id;

  -- Only allow safe status transitions by owners
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NOT (
      (OLD.status = 'active'  AND NEW.status = 'paused') OR
      (OLD.status = 'paused'  AND NEW.status = 'active') OR
      (OLD.status = 'draft'   AND NEW.status = 'pending_review') OR
      (OLD.status = 'rejected' AND NEW.status = 'pending_review')
    ) THEN
      RAISE EXCEPTION 'Campaign status change not permitted';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_ad_campaign_owner_update_trg ON public.ad_campaigns;
CREATE TRIGGER guard_ad_campaign_owner_update_trg
BEFORE UPDATE ON public.ad_campaigns
FOR EACH ROW EXECUTE FUNCTION public.guard_ad_campaign_owner_update();