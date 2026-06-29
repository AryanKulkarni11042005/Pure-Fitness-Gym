/**
 * analytics.js — Pure Fitness Gym
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles all GA4 + Google Ads tracking for pure-fitness-gym.vercel.app
 *
 * GA4 Measurement ID  : G-6WQ4S80YRN
 * Google Ads Conv. ID : AW-15170545539
 *
 * HOW IT WORKS
 * ─────────────
 * 1. gtag() is already initialised by the inline script in <head>.
 *    This file only adds event tracking — it never re-loads gtag.js.
 * 2. All public tracking functions are exposed on window.PFAnalytics so
 *    any other script (e.g. a future contact-form handler) can call them.
 * 3. DOM event listeners are registered in initTracking(), which fires
 *    after DOMContentLoaded so every element is guaranteed to exist.
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ─── CONSTANTS ──────────────────────────────────────────────────────────────

  /** GA4 measurement ID */
  var GA4_ID = 'G-6WQ4S80YRN';

  /**
   * Google Ads conversion ID.
   * Individual conversion *labels* are created inside Google Ads
   * (Tools → Conversions → + New conversion action).
   * Replace the LABEL placeholders below with the label strings
   * you get from each conversion action you create there.
   */
  var ADS_ID = 'AW-15170545539';

  /**
   * Conversion labels — fill these in from your Google Ads account.
   * Each unique action (WhatsApp click, directions, etc.) should have
   * its own conversion action + label so you can optimise bids per action.
   *
   * Example label format:  'AbCdEfGhIjKlMnO'
   */
  var ADS_LABELS = {
    whatsapp_click       : 'REPLACE_WITH_LABEL',  // WhatsApp button click
    directions_click     : 'REPLACE_WITH_LABEL',  // Get Directions click
    membership_inquiry   : 'REPLACE_WITH_LABEL',  // Membership enquiry WA click
    free_trial_click     : 'REPLACE_WITH_LABEL',  // Future free-trial CTA
    contact_form_submit  : 'REPLACE_WITH_LABEL',  // Future contact form submit
  };


  // ─── SAFETY GUARD ───────────────────────────────────────────────────────────

  /**
   * Safely call gtag().
   * Prevents errors if the ad-blocker removes the gtag script entirely.
   */
  function track() {
    if (typeof window.gtag === 'function') {
      window.gtag.apply(window, arguments);
    }
  }


  // ─── GA4 EVENT HELPERS ──────────────────────────────────────────────────────

  /**
   * Send a GA4 custom event.
   * @param {string} eventName   - snake_case event name (appears in GA4 Events tab)
   * @param {Object} [params]    - additional event parameters
   */
  function trackEvent(eventName, params) {
    track('event', eventName, Object.assign({
      send_to: GA4_ID,
    }, params || {}));
  }

  /**
   * Send a Google Ads conversion event.
   * Only fires if the label has been filled in (not the placeholder).
   * @param {string} labelKey  - key in ADS_LABELS
   * @param {Object} [params]  - optional extra params (value, currency, etc.)
   */
  function trackConversion(labelKey, params) {
    var label = ADS_LABELS[labelKey];
    if (!label || label === 'REPLACE_WITH_LABEL') return; // skip until label is set
    track('event', 'conversion', Object.assign({
      send_to: ADS_ID + '/' + label,
    }, params || {}));
  }


  // ─── PUBLIC TRACKING FUNCTIONS ──────────────────────────────────────────────
  // Attach these to any element via onclick or addEventListener.
  // They are also exposed on window.PFAnalytics for external use.

  /**
   * Track a WhatsApp button click.
   * @param {string} source - where the button is (e.g. 'floating', 'location', 'footer', 'plan_monthly')
   */
  function trackWhatsAppClick(source) {
    trackEvent('whatsapp_click', {
      event_category : 'engagement',
      event_label    : source || 'unknown',
    });
    trackConversion('whatsapp_click');
  }

  /**
   * Track a phone / call button click.
   * Wire this up if you add a tel: link or call button in the future.
   * @param {string} source
   */
  function trackCallClick(source) {
    trackEvent('call_click', {
      event_category : 'engagement',
      event_label    : source || 'unknown',
    });
  }

  /**
   * Track the "Get Directions" link click.
   */
  function trackDirectionsClick() {
    trackEvent('directions_click', {
      event_category : 'engagement',
      event_label    : 'google_maps',
    });
    trackConversion('directions_click');
  }

  /**
   * Track a free-trial CTA click.
   * Wire this up when you add a free-trial button to the site.
   * @param {string} source
   */
  function trackFreeTrialClick(source) {
    trackEvent('free_trial_click', {
      event_category : 'lead',
      event_label    : source || 'unknown',
    });
    trackConversion('free_trial_click');
  }

  /**
   * Track a membership enquiry button click (the plan-card WA buttons).
   * @param {string} plan - 'monthly' | 'quarterly' | 'annual'
   */
  function trackMembershipInquiry(plan) {
    trackEvent('membership_inquiry_click', {
      event_category : 'lead',
      event_label    : plan || 'unknown',
    });
    trackConversion('membership_inquiry');
  }

  /**
   * Track a contact / membership form submission.
   * Call this inside your form's submit handler.
   * @param {string} formName
   */
  function trackFormSubmit(formName) {
    trackEvent('contact_form_submit', {
      event_category : 'lead',
      event_label    : formName || 'unknown',
    });
    trackConversion('contact_form_submit');
  }


  // ─── DOM EVENT LISTENERS ────────────────────────────────────────────────────

  function initTracking() {

    // ── WhatsApp: floating bubble ──────────────────────────────────────────
    var waFloat = document.getElementById('waFloat');
    if (waFloat) {
      waFloat.addEventListener('click', function () {
        trackWhatsAppClick('floating_button');
      });
    }

    // ── WhatsApp: Location section ─────────────────────────────────────────
    var locWaBtn = document.getElementById('locWaBtn');
    if (locWaBtn) {
      locWaBtn.addEventListener('click', function () {
        trackWhatsAppClick('location_section');
      });
    }

    // ── WhatsApp: Footer ───────────────────────────────────────────────────
    var footerWaBtn = document.getElementById('footerWaBtn');
    if (footerWaBtn) {
      footerWaBtn.addEventListener('click', function () {
        trackWhatsAppClick('footer');
      });
    }

    // ── Membership plan: Monthly ───────────────────────────────────────────
    var planMonthly = document.getElementById('planMonthlyBtn');
    if (planMonthly) {
      planMonthly.addEventListener('click', function () {
        trackMembershipInquiry('monthly');
        trackWhatsAppClick('plan_monthly');
      });
    }

    // ── Membership plan: Quarterly ─────────────────────────────────────────
    var planQuarterly = document.getElementById('planQuarterlyBtn');
    if (planQuarterly) {
      planQuarterly.addEventListener('click', function () {
        trackMembershipInquiry('quarterly');
        trackWhatsAppClick('plan_quarterly');
      });
    }

    // ── Membership plan: Annual ────────────────────────────────────────────
    var planAnnual = document.getElementById('planAnnualBtn');
    if (planAnnual) {
      planAnnual.addEventListener('click', function () {
        trackMembershipInquiry('annual');
        trackWhatsAppClick('plan_annual');
      });
    }

    // ── Directions button ──────────────────────────────────────────────────
    var directionsBtn = document.getElementById('directionsBtn');
    if (directionsBtn) {
      directionsBtn.addEventListener('click', function () {
        trackDirectionsClick();
      });
    }

    // ── Hero CTA: "Start Your Journey" ────────────────────────────────────
    //    Treated as a free-trial / primary CTA signal
    var heroJoinBtn = document.getElementById('heroJoinBtn');
    if (heroJoinBtn) {
      heroJoinBtn.addEventListener('click', function () {
        trackFreeTrialClick('hero_cta');
      });
    }

    // ── About section CTA ─────────────────────────────────────────────────
    var aboutJoinBtn = document.getElementById('aboutJoinBtn');
    if (aboutJoinBtn) {
      aboutJoinBtn.addEventListener('click', function () {
        trackFreeTrialClick('about_cta');
      });
    }

    // ── Services section CTA ──────────────────────────────────────────────
    var servicesJoinBtn = document.getElementById('servicesJoinBtn');
    if (servicesJoinBtn) {
      servicesJoinBtn.addEventListener('click', function () {
        trackFreeTrialClick('services_cta');
      });
    }

    // ── Nav "Join Now" button ──────────────────────────────────────────────
    var navJoinBtn = document.getElementById('navJoinBtn');
    if (navJoinBtn) {
      navJoinBtn.addEventListener('click', function () {
        trackFreeTrialClick('nav_join_now');
      });
    }

    // ── FUTURE: Call button ────────────────────────────────────────────────
    // If you add a tel: link, give it id="callBtn" and it will be tracked:
    var callBtn = document.getElementById('callBtn');
    if (callBtn) {
      callBtn.addEventListener('click', function () {
        trackCallClick('call_button');
      });
    }

    // ── FUTURE: Contact / membership form ─────────────────────────────────
    // If you add a <form id="contactForm">, submissions are tracked here:
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        // Do NOT call e.preventDefault() here — let the form submit normally.
        trackFormSubmit('contact_form');
      });
    }

    // ── Scroll depth milestones (25 / 50 / 75 / 100%) ────────────────────
    // Tells GA4 how far visitors actually read the page.
    var scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
    window.addEventListener('scroll', function () {
      var scrollTop    = window.scrollY || document.documentElement.scrollTop;
      var docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPct    = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      [25, 50, 75, 100].forEach(function (milestone) {
        if (!scrollMilestones[milestone] && scrollPct >= milestone) {
          scrollMilestones[milestone] = true;
          trackEvent('scroll_depth', {
            event_category : 'engagement',
            event_label    : milestone + '%',
            value          : milestone,
          });
        }
      });
    }, { passive: true });

  }


  // ─── EXPOSE PUBLIC API ──────────────────────────────────────────────────────
  // Other scripts can call e.g. window.PFAnalytics.trackWhatsAppClick('footer')

  window.PFAnalytics = {
    trackWhatsAppClick   : trackWhatsAppClick,
    trackCallClick       : trackCallClick,
    trackDirectionsClick : trackDirectionsClick,
    trackFreeTrialClick  : trackFreeTrialClick,
    trackMembershipInquiry: trackMembershipInquiry,
    trackFormSubmit      : trackFormSubmit,
    trackEvent           : trackEvent,
  };


  // ─── BOOT ───────────────────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    // DOMContentLoaded already fired (e.g. script placed at bottom of body)
    initTracking();
  }

}());
