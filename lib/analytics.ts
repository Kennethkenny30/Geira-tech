/**
 * Advanced Analytics Tracking System
 * Intégration avec GA4, PostHog, et tracking personnalisé
 */

interface AnalyticsConfig {
  ga4MeasurementId?: string
  posthogKey?: string
  environment?: "development" | "production"
}

interface UserProperties {
  userId?: string
  sessionId?: string
  timestamp?: number
  userAgent?: string
  locale?: string
  [key: string]: unknown
}

class AnalyticsTracker {
  private config: AnalyticsConfig
  private sessionId: string
  private startTime: number
  private events: unknown[] = []

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      environment: "production",
      ...config,
    }
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    this.initializeTrackers()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeTrackers(): void {
    if (typeof window === "undefined") return

    // Initialize Google Analytics 4
    if (this.config.ga4MeasurementId && !window.gtag) {
      const script = document.createElement("script")
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.ga4MeasurementId}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = function () {
        window.dataLayer!.push(arguments)
      }
      window.gtag("js", new Date())
      window.gtag("config", this.config.ga4MeasurementId)
    }

    // Initialize PostHog
    if (this.config.posthogKey && !window.posthog) {
      const script = document.createElement("script")
      script.innerHTML = `
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]]),t[o.length-1]]=a}p=e._i[i]={},e._i.push(p),p._protocol="https",p._url=e.decide&&e.decide.config_url_override?e.decide.config_url_override:s.api_host,p.capture_pageview=!1,p.capture_pageleave=!1})
      `
      document.head.appendChild(script)
    }
  }

  /**
   * Track generic event
   */
  trackEvent(
    eventName: string,
    properties?: Record<string, unknown>
  ): void {
    const eventData = {
      eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        timeOnSite: Date.now() - this.startTime,
      },
    }

    this.events.push(eventData)

    if (this.config.environment === "development") {
      console.log("[Analytics] Event:", eventName, eventData.properties)
    }

    try {
      // Send to GA4
      if (window.gtag) {
        window.gtag("event", eventName, eventData.properties)
      }

      // Send to PostHog
      if (window.posthog) {
        window.posthog.capture(eventName, eventData.properties)
      }
    } catch (error) {
      console.error("[Analytics] Error tracking event:", error)
    }
  }

  /**
   * Track page views
   */
  trackPageView(path: string, pageTitle?: string): void {
    this.trackEvent("page_view", {
      path,
      title: pageTitle || document.title,
      referrer: document.referrer,
      url: window.location.href,
    })
  }

  /**
   * Track CTA clicks with context
   */
  trackCTAClick(
    ctaId: string,
    ctaText: string,
    location: string,
    additionalData?: Record<string, unknown>
  ): void {
    this.trackEvent("cta_click", {
      cta_id: ctaId,
      cta_text: ctaText,
      location,
      elementType: document.getElementById(ctaId)?.tagName,
      ...additionalData,
    })
  }

  /**
   * Track form interactions
   */
  trackFormInteraction(
    formId: string,
    action: "start" | "fill" | "submit" | "error",
    fieldName?: string,
    errorMessage?: string
  ): void {
    this.trackEvent("form_interaction", {
      form_id: formId,
      action,
      field_name: fieldName,
      error_message: errorMessage,
    })
  }

  /**
   * Track form submissions
   */
  trackFormSubmit(
    formId: string,
    success: boolean,
    errors?: string[],
    formData?: Record<string, unknown>
  ): void {
    this.trackEvent("form_submit", {
      form_id: formId,
      success,
      errors,
      fields_completed: Object.keys(formData || {}).length,
      submission_time: Date.now() - this.startTime,
    })
  }

  /**
   * Track service views/clicks
   */
  trackServiceView(
    serviceId: string,
    serviceName: string,
    category?: string
  ): void {
    this.trackEvent("service_view", {
      service_id: serviceId,
      service_name: serviceName,
      category,
    })
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(depth: number, section?: string): void {
    this.trackEvent("scroll_depth", {
      depth_percentage: depth,
      section,
      time_to_depth: Date.now() - this.startTime,
    })
  }

  /**
   * Track element interactions (hovers, clicks, etc.)
   */
  trackInteraction(
    elementId: string,
    interactionType: "hover" | "click" | "focus",
    additionalData?: Record<string, unknown>
  ): void {
    this.trackEvent("element_interaction", {
      element_id: elementId,
      interaction_type: interactionType,
      ...additionalData,
    })
  }

  /**
   * Track video/media events
   */
  trackMediaEvent(
    mediaId: string,
    mediaType: "video" | "audio" | "image",
    action: "play" | "pause" | "complete" | "error",
    duration?: number
  ): void {
    this.trackEvent("media_event", {
      media_id: mediaId,
      media_type: mediaType,
      action,
      duration,
    })
  }

  /**
   * Track user engagement time
   */
  trackEngagementTime(section: string, timeSpent: number): void {
    this.trackEvent("engagement_time", {
      section,
      time_spent_ms: timeSpent,
      time_spent_seconds: Math.round(timeSpent / 1000),
    })
  }

  /**
   * Track conversion events
   */
  trackConversion(
    conversionType: string,
    value?: number,
    currency?: string,
    metadata?: Record<string, unknown>
  ): void {
    this.trackEvent("conversion", {
      conversion_type: conversionType,
      value,
      currency,
      ...metadata,
    })
  }

  /**
   * Track error events
   */
  trackError(
    errorType: string,
    errorMessage: string,
    stackTrace?: string,
    context?: Record<string, unknown>
  ): void {
    this.trackEvent("error", {
      error_type: errorType,
      error_message: errorMessage,
      stack_trace: stackTrace,
      context,
    })
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number, unit?: string): void {
    this.trackEvent("performance_metric", {
      metric,
      value,
      unit,
    })
  }

  /**
   * Get session info
   */
  getSessionInfo(): {
    sessionId: string
    startTime: number
    duration: number
    eventCount: number
  } {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      duration: Date.now() - this.startTime,
      eventCount: this.events.length,
    }
  }

  /**
   * Get all tracked events (for debugging)
   */
  getEvents(): unknown[] {
    return [...this.events]
  }

  /**
   * Clear events (e.g., on logout)
   */
  clearEvents(): void {
    this.events = []
  }
}

// Create singleton instance
let analyticsInstance: AnalyticsTracker | null = null

/**
 * Initialize analytics with config
 */
export function initializeAnalytics(config: AnalyticsConfig): AnalyticsTracker {
  if (typeof window === "undefined") {
    return new AnalyticsTracker(config)
  }

  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsTracker(config)
  }

  return analyticsInstance
}

/**
 * Get analytics instance (creates with defaults if not initialized)
 */
export function getAnalytics(): AnalyticsTracker {
  if (!analyticsInstance) {
    const config: AnalyticsConfig = {
      ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
      posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      environment: process.env.NODE_ENV as "development" | "production",
    }
    analyticsInstance = new AnalyticsTracker(config)
  }

  return analyticsInstance
}

// Export convenience functions
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  getAnalytics().trackEvent(eventName, properties)
}

export function trackPageView(path: string, pageTitle?: string): void {
  getAnalytics().trackPageView(path, pageTitle)
}

export function trackCTAClick(
  ctaId: string,
  ctaText: string,
  location: string,
  additionalData?: Record<string, unknown>
): void {
  getAnalytics().trackCTAClick(ctaId, ctaText, location, additionalData)
}

export function trackFormInteraction(
  formId: string,
  action: "start" | "fill" | "submit" | "error",
  fieldName?: string,
  errorMessage?: string
): void {
  getAnalytics().trackFormInteraction(formId, action, fieldName, errorMessage)
}

export function trackFormSubmit(
  formId: string,
  success: boolean,
  errors?: string[],
  formData?: Record<string, unknown>
): void {
  getAnalytics().trackFormSubmit(formId, success, errors, formData)
}

export function trackServiceView(
  serviceId: string,
  serviceName: string,
  category?: string
): void {
  getAnalytics().trackServiceView(serviceId, serviceName, category)
}

export function trackScrollDepth(depth: number, section?: string): void {
  getAnalytics().trackScrollDepth(depth, section)
}

export function trackInteraction(
  elementId: string,
  interactionType: "hover" | "click" | "focus",
  additionalData?: Record<string, unknown>
): void {
  getAnalytics().trackInteraction(elementId, interactionType, additionalData)
}

export function trackMediaEvent(
  mediaId: string,
  mediaType: "video" | "audio" | "image",
  action: "play" | "pause" | "complete" | "error",
  duration?: number
): void {
  getAnalytics().trackMediaEvent(mediaId, mediaType, action, duration)
}

export function trackEngagementTime(section: string, timeSpent: number): void {
  getAnalytics().trackEngagementTime(section, timeSpent)
}

export function trackConversion(
  conversionType: string,
  value?: number,
  currency?: string,
  metadata?: Record<string, unknown>
): void {
  getAnalytics().trackConversion(conversionType, value, currency, metadata)
}

export function trackError(
  errorType: string,
  errorMessage: string,
  stackTrace?: string,
  context?: Record<string, unknown>
): void {
  getAnalytics().trackError(errorType, errorMessage, stackTrace, context)
}

export function trackPerformance(
  metric: string,
  value: number,
  unit?: string
): void {
  getAnalytics().trackPerformance(metric, value, unit)
}

export function getSessionInfo(): {
  sessionId: string
  startTime: number
  duration: number
  eventCount: number
} {
  return getAnalytics().getSessionInfo()
}

export function getEvents(): unknown[] {
  return getAnalytics().getEvents()
}

export function clearEvents(): void {
  getAnalytics().clearEvents()
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    posthog?: {
      capture: (eventName: string, properties?: Record<string, unknown>) => void
    }
  }
}