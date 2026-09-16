import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  CONSENT_OPEN_EVENT,
  getStoredConsent,
  isConsentRequiredRegion,
  setStoredConsent,
} from '@/utils/consent';

/**
 * Cookie consent banner.
 *
 * Shown automatically only to visitors in regions that require prior consent
 * (EEA, UK, Switzerland, plus unknown/Tor locations). Everyone can reopen it
 * from the "Cookie Preferences" link in the footer.
 */
export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!getStoredConsent()) {
      void isConsentRequiredRegion().then((required) => {
        if (!cancelled && required) setVisible(true);
      });
    }

    const openHandler = () => {
      setManual(true);
      setVisible(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, openHandler);
    return () => {
      cancelled = true;
      window.removeEventListener(CONSENT_OPEN_EVENT, openHandler);
    };
  }, []);

  if (!visible) return null;

  const choose = (choice: 'granted' | 'denied') => {
    const previous = getStoredConsent();
    setStoredConsent(choice);
    setVisible(false);
    // Withdrawing after vendors already loaded requires a reload to tear them
    // down; granting is handled live by the tracking loader.
    if (choice === 'denied' && previous !== 'denied') {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] p-3 sm:p-4">
      <div className="mx-auto max-w-4xl rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur sm:p-5">
        <h2 className="text-sm font-semibold text-foreground">
          {manual ? 'Cookie preferences' : 'We value your privacy'}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          We use cookies and similar technologies for analytics (Google Analytics,
          Microsoft Clarity) and advertising (Google AdSense). These vendors may process
          your IP address and browsing data outside the EEA. Nothing non-essential loads
          until you accept. You can change or withdraw your choice at any time via
          &quot;Cookie Preferences&quot; in the footer.{' '}
          <Link to="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" size="sm" onClick={() => choose('denied')}>
            Reject all
          </Button>
          <Button size="sm" onClick={() => choose('granted')}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
