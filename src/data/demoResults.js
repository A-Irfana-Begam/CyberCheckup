// Deterministic pseudo-random based on a string seed so the same URL
// always produces the same report, but different URLs vary.
function seededRandom(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

export const CATEGORIES = [
  'Transport Security',
  'Security Headers',
  'Cookie Security',
  'Cross-Origin Security',
  'Browser Protection',
];

// Each finding template. `weight` contributes to the score.
// `status` is a function of the random generator so results vary by URL.
const FINDING_TEMPLATES = [
  {
    id: 'https',
    category: 'Transport Security',
    name: 'HTTPS Encryption',
    weight: 14,
    variants: {
      pass: {
        severity: 'good',
        result: 'Your website is served over a secure HTTPS connection.',
        what: 'Your website loads over HTTPS with a valid, trusted TLS connection. Data exchanged between visitors and your site is encrypted.',
        why: 'HTTPS protects sensitive information — like login details, form submissions, and personal data — from being intercepted while traveling across the internet.',
        fix: 'No action needed. Keep your TLS certificate renewed and redirect all HTTP traffic to HTTPS.',
        priority: 'Maintained',
      },
      fail: {
        severity: 'critical',
        result: 'Your website is not using a secure HTTPS connection.',
        what: 'Your website does not appear to serve content over HTTPS. Visitors can access it over an unencrypted HTTP connection.',
        why: 'Without HTTPS, any data sent between your visitors and your website can be read or modified by attackers on the network. Browsers also warn users that the site is "Not Secure."',
        fix: 'Obtain and install a free TLS certificate (for example from Let\'s Encrypt), configure your server for HTTPS, and redirect all HTTP requests to HTTPS.',
        priority: 'Fix immediately',
      },
    },
  },
  {
    id: 'tls',
    category: 'Transport Security',
    name: 'TLS Certificate Validity',
    weight: 10,
    variants: {
      pass: {
        severity: 'good',
        result: 'Your TLS certificate is valid and trusted.',
        what: 'Your website\'s TLS certificate is valid, issued by a trusted authority, and has not expired.',
        why: 'A valid certificate lets browsers confirm they are connected to the genuine website and not an impostor. Expired or untrusted certificates trigger security warnings that drive visitors away.',
        fix: 'No action needed. Set a reminder to renew the certificate before it expires, or enable automatic renewal.',
        priority: 'Maintained',
      },
      warn: {
        severity: 'medium',
        result: 'Your TLS certificate is valid but may expire soon.',
        what: 'Your TLS certificate is currently valid but is approaching its expiration date.',
        why: 'If the certificate expires, browsers will display security warnings and may block visitors from reaching your site.',
        fix: 'Renew the certificate before it expires and enable automatic renewal if your provider supports it.',
        priority: 'Recommended',
      },
    },
  },
  {
    id: 'hsts',
    category: 'Transport Security',
    name: 'Strict Transport Security (HSTS)',
    weight: 10,
    variants: {
      pass: {
        severity: 'good',
        result: 'HSTS is enabled with a strong max-age value.',
        what: 'Your website sends a Strict-Transport-Security header instructing browsers to always use HTTPS.',
        why: 'HSTS prevents downgrade attacks where a visitor is forced onto an insecure HTTP connection, even if they type http:// by mistake.',
        fix: 'No action needed. Keep the max-age value high (at least one year) and include subdomains if appropriate.',
        priority: 'Maintained',
      },
      warn: {
        severity: 'medium',
        result: 'HSTS is missing or has a short max-age value.',
        what: 'Your website does not send a Strict-Transport-Security header, or the max-age value is very short.',
        why: 'Without HSTS, visitors may be vulnerable to downgrade attacks that force them onto an insecure connection, even when HTTPS is available.',
        fix: 'Add the header: Strict-Transport-Security: max-age=31536000; includeSubDomains',
        priority: 'Recommended',
      },
      fail: {
        severity: 'high',
        result: 'HSTS is not configured.',
        what: 'No Strict-Transport-Security header was detected on your website.',
        why: 'Without HSTS, a visitor who types http:// or follows a tampered link can be downgraded to an insecure connection, exposing them to interception.',
        fix: 'Add the header: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
        priority: 'Fix soon',
      },
    },
  },
  {
    id: 'csp',
    category: 'Security Headers',
    name: 'Content-Security-Policy',
    weight: 14,
    variants: {
      pass: {
        severity: 'good',
        result: 'A Content-Security-Policy is configured.',
        what: 'Your website sends a Content-Security-Policy header that restricts which resources can load and execute.',
        why: 'CSP is one of the strongest defenses against cross-site scripting (XSS) and unauthorized content injection, by telling browsers exactly what is allowed.',
        fix: 'No action needed. Review the policy periodically as your site evolves.',
        priority: 'Maintained',
      },
      warn: {
        severity: 'medium',
        result: 'Content-Security-Policy is present but permissive.',
        what: 'A Content-Security-Policy header was found, but it allows broad sources such as unsafe inline scripts or wildcards.',
        why: 'A permissive CSP offers limited protection and can still allow injected scripts to run, weakening your defense against XSS.',
        fix: 'Tighten the policy by removing unsafe-inline and wildcard sources, and use nonces or hashes for inline scripts.',
        priority: 'Recommended',
      },
      fail: {
        severity: 'critical',
        result: 'No Content-Security-Policy header detected.',
        what: 'Your website does not send a Content-Security-Policy header.',
        why: 'Without CSP, there is no browser-enforced limit on what scripts and resources can run, making cross-site scripting attacks far more dangerous.',
        fix: 'Add a Content-Security-Policy header. Start permissive (report-only) and tighten as you verify what your site needs.',
        priority: 'Fix immediately',
      },
    },
  },
  {
    id: 'x-frame',
    category: 'Security Headers',
    name: 'Frame Protection (X-Frame-Options)',
    weight: 8,
    variants: {
      pass: {
        severity: 'good',
        result: 'Frame protection is enabled.',
        what: 'Your website sends X-Frame-Options or a frame-ancestors CSP directive preventing it from being embedded by other sites.',
        why: 'This protects against clickjacking, where attackers overlay your site with invisible elements to trick visitors into clicking things they did not intend.',
        fix: 'No action needed. Prefer the CSP frame-ancestors directive as the modern approach.',
        priority: 'Maintained',
      },
      fail: {
        severity: 'medium',
        result: 'No frame protection header detected.',
        what: 'Your website can be embedded in a frame on any other website.',
        why: 'Without frame protection, attackers can layer your site inside their own page and trick visitors into clicking hidden buttons or links — a technique called clickjacking.',
        fix: 'Add X-Frame-Options: SAMEORIGIN, or preferably a Content-Security-Policy with frame-ancestors \'self\'.',
        priority: 'Recommended',
      },
    },
  },
  {
    id: 'x-content-type',
    category: 'Security Headers',
    name: 'MIME-Type Protection (X-Content-Type-Options)',
    weight: 6,
    variants: {
      pass: {
        severity: 'good',
        result: 'MIME-type sniffing is disabled.',
        what: 'Your website sends X-Content-Type-Options: nosniff, telling browsers to respect declared content types.',
        why: 'This prevents browsers from "guessing" file types, which can otherwise let an uploaded text file be executed as a script.',
        fix: 'No action needed.',
        priority: 'Maintained',
      },
      fail: {
        severity: 'medium',
        result: 'MIME-type protection header is missing.',
        what: 'Your website does not send the X-Content-Type-Options header.',
        why: 'Without this header, browsers may reinterpret certain resources as a different type than intended, which can turn harmless uploads into executable scripts.',
        fix: 'Add the header: X-Content-Type-Options: nosniff',
        priority: 'Recommended',
      },
    },
  },
  {
    id: 'referrer-policy',
    category: 'Security Headers',
    name: 'Referrer-Policy',
    weight: 5,
    variants: {
      pass: {
        severity: 'good',
        result: 'Referrer-Policy is configured.',
        what: 'Your website sends a Referrer-Policy header controlling how much referrer information is shared.',
        why: 'This prevents sensitive URL details (like query parameters) from leaking to third-party sites when visitors follow external links.',
        fix: 'No action needed. strict-origin-when-cross-origin is a sensible default.',
        priority: 'Maintained',
      },
      warn: {
        severity: 'low',
        result: 'Referrer-Policy is missing or very permissive.',
        what: 'Your website does not send a Referrer-Policy header, or it allows full referrer URLs to be shared.',
        why: 'Full referrer information can expose sensitive URL parameters to any external site a visitor navigates to.',
        fix: 'Add the header: Referrer-Policy: strict-origin-when-cross-origin',
        priority: 'Improvement',
      },
    },
  },
  {
    id: 'permissions-policy',
    category: 'Security Headers',
    name: 'Permissions-Policy',
    weight: 5,
    variants: {
      pass: {
        severity: 'good',
        result: 'Permissions-Policy is configured.',
        what: 'Your website sends a Permissions-Policy header restricting access to powerful browser features.',
        why: 'This limits what features (like the camera, microphone, or geolocation) your site and embedded content can use, reducing the impact of a compromise.',
        fix: 'No action needed. Review allowed features as your site changes.',
        priority: 'Maintained',
      },
      warn: {
        severity: 'low',
        result: 'Permissions-Policy is not set.',
        what: 'Your website does not send a Permissions-Policy header.',
        why: 'Without it, powerful browser features remain available to your site and any embedded content, which can be abused if a vulnerability is introduced.',
        fix: 'Add a Permissions-Policy header listing only the features your site needs.',
        priority: 'Improvement',
      },
    },
  },
  {
    id: 'cookie-secure',
    category: 'Cookie Security',
    name: 'Secure Cookie Flag',
    weight: 8,
    variants: {
      pass: {
        severity: 'good',
        result: 'Cookies are marked Secure.',
        what: 'The cookies your website sets include the Secure flag, so they are only sent over HTTPS.',
        why: 'This prevents session and tracking cookies from being exposed over unencrypted connections where attackers could steal them.',
        fix: 'No action needed.',
        priority: 'Maintained',
      },
      fail: {
        severity: 'high',
        result: 'Some cookies are missing the Secure flag.',
        what: 'One or more cookies set by your website do not include the Secure flag.',
        why: 'Without the Secure flag, cookies can be sent over plain HTTP, where they can be intercepted and used to impersonate your visitors.',
        fix: 'Set the Secure attribute on every cookie your site issues, especially session cookies.',
        priority: 'Fix soon',
      },
    },
  },
  {
    id: 'cookie-httponly',
    category: 'Cookie Security',
    name: 'HttpOnly Cookie Flag',
    weight: 7,
    variants: {
      pass: {
        severity: 'good',
        result: 'Session cookies use the HttpOnly flag.',
        what: 'Your website\'s cookies include the HttpOnly flag, so they cannot be read by JavaScript.',
        why: 'This greatly reduces the impact of cross-site scripting attacks, because injected scripts cannot steal session cookies.',
        fix: 'No action needed.',
        priority: 'Maintained',
      },
      warn: {
        severity: 'medium',
        result: 'Some cookies are missing the HttpOnly flag.',
        what: 'One or more cookies do not include the HttpOnly flag and can be read by JavaScript running in the browser.',
        why: 'If a script-injection vulnerability exists anywhere on your site, attackers could use it to steal these cookies.',
        fix: 'Set the HttpOnly attribute on cookies that do not need to be read by client-side JavaScript.',
        priority: 'Recommended',
      },
    },
  },
  {
    id: 'cookie-samesite',
    category: 'Cookie Security',
    name: 'SameSite Cookie Attribute',
    weight: 7,
    variants: {
      pass: {
        severity: 'good',
        result: 'Cookies use a SameSite attribute.',
        what: 'Your cookies include a SameSite attribute (Lax or Strict), limiting when they are sent on cross-site requests.',
        why: 'This is a key defense against cross-site request forgery (CSRF), where a third-party site tricks a visitor\'s browser into making unwanted requests.',
        fix: 'No action needed. SameSite=Lax or Strict is recommended for session cookies.',
        priority: 'Maintained',
      },
      warn: {
        severity: 'medium',
        result: 'SameSite attribute is not set on all cookies.',
        what: 'One or more cookies do not specify a SameSite attribute.',
        why: 'Cookies without SameSite can be sent on cross-site requests, increasing exposure to CSRF attacks.',
        fix: 'Set SameSite=Lax or SameSite=Strict on every cookie your site issues.',
        priority: 'Recommended',
      },
    },
  },
  {
    id: 'coop',
    category: 'Cross-Origin Security',
    name: 'Cross-Origin-Opener-Policy (COOP)',
    weight: 6,
    variants: {
      pass: {
        severity: 'good',
        result: 'COOP is enabled.',
        what: 'Your website sends a Cross-Origin-Opener-Policy header, isolating it from other origins.',
        why: 'COOP prevents malicious sites from accessing your site\'s window object, blocking a class of attacks called cross-origin window interception.',
        fix: 'No action needed.',
        priority: 'Maintained',
      },
      warn: {
        severity: 'low',
        result: 'COOP is not configured.',
        what: 'Your website does not send a Cross-Origin-Opener-Policy header.',
        why: 'Without COOP, your site can share its browsing context with other origins, which can enable certain cross-origin attacks.',
        fix: 'Add the header: Cross-Origin-Opener-Policy: same-origin',
        priority: 'Improvement',
      },
    },
  },
  {
    id: 'coep',
    category: 'Cross-Origin Security',
    name: 'Cross-Origin-Embedder-Policy (COEP)',
    weight: 6,
    variants: {
      pass: {
        severity: 'good',
        result: 'COEP is enabled.',
        what: 'Your website sends a Cross-Origin-Embedder-Policy header requiring cross-origin resources to be explicitly authorized.',
        why: 'COEP enables cross-origin isolation, which unlocks powerful security features and blocks unauthorized cross-origin resources from loading.',
        fix: 'No action needed. Ensure cross-origin resources send the correct CORP/CORS headers.',
        priority: 'Maintained',
      },
      warn: {
        severity: 'low',
        result: 'COEP is not configured.',
        what: 'Your website does not send a Cross-Origin-Embedder-Policy header.',
        why: 'Without COEP, your site cannot achieve cross-origin isolation, missing an additional layer of defense against side-channel attacks.',
        fix: 'Add the header: Cross-Origin-Embedder-Policy: require-corp (verify your third-party resources support it first).',
        priority: 'Improvement',
      },
    },
  },
  {
    id: 'corp',
    category: 'Cross-Origin Security',
    name: 'Cross-Origin-Resource-Policy (CORP)',
    weight: 5,
    variants: {
      pass: {
        severity: 'good',
        result: 'CORP is configured.',
        what: 'Your website sends a Cross-Origin-Resource-Policy header limiting who can embed your resources.',
        why: 'CORP prevents other websites from loading your resources in sensitive contexts, reducing the risk of cross-origin data leakage.',
        fix: 'No action needed.',
        priority: 'Maintained',
      },
      warn: {
        severity: 'low',
        result: 'CORP is not set.',
        what: 'Your website does not send a Cross-Origin-Resource-Policy header.',
        why: 'Without CORP, your resources may be embedded by arbitrary websites, which can be abused in cross-origin attack scenarios.',
        fix: 'Add the header: Cross-Origin-Resource-Policy: same-origin',
        priority: 'Improvement',
      },
    },
  },
  {
    id: 'mime-sniff',
    category: 'Browser Protection',
    name: 'MIME Sniffing Protection',
    weight: 5,
    variants: {
      pass: {
        severity: 'good',
        result: 'Browsers are prevented from sniffing MIME types.',
        what: 'Your website instructs browsers not to sniff or reinterpret the MIME type of responses.',
        why: 'This prevents a browser from executing an uploaded file as a script just because its content looks like one.',
        fix: 'No action needed. This is controlled by the X-Content-Type-Options header.',
        priority: 'Maintained',
      },
      fail: {
        severity: 'medium',
        result: 'MIME sniffing is not disabled.',
        what: 'Your website does not prevent browsers from sniffing MIME types.',
        why: 'Browsers may reinterpret file types, which can turn an otherwise harmless upload into executable script content.',
        fix: 'Add the header: X-Content-Type-Options: nosniff',
        priority: 'Recommended',
      },
    },
  },
  {
    id: 'clickjacking',
    category: 'Browser Protection',
    name: 'Clickjacking Protection',
    weight: 6,
    variants: {
      pass: {
        severity: 'good',
        result: 'Your site cannot be framed by other websites.',
        what: 'Your website prevents other sites from embedding it in a frame, so visitors always interact with the genuine page.',
        why: 'This blocks clickjacking attacks where invisible overlays trick visitors into clicking hidden buttons or links.',
        fix: 'No action needed.',
        priority: 'Maintained',
      },
      fail: {
        severity: 'medium',
        result: 'Your site can be embedded by other websites.',
        what: 'Your website does not prevent other sites from loading it inside a frame.',
        why: 'Attackers can overlay your site with invisible elements and trick visitors into performing actions they did not intend.',
        fix: 'Add X-Frame-Options: SAMEORIGIN or a CSP frame-ancestors directive.',
        priority: 'Recommended',
      },
    },
  },
  {
    id: 'referrer-leak',
    category: 'Browser Protection',
    name: 'Referrer Leakage Protection',
    weight: 4,
    variants: {
      pass: {
        severity: 'good',
        result: 'Referrer information is limited.',
        what: 'Your website limits how much referrer information is shared when visitors navigate to other sites.',
        why: 'This prevents sensitive URL details — like search queries or session IDs — from leaking to third parties.',
        fix: 'No action needed.',
        priority: 'Maintained',
      },
      warn: {
        severity: 'low',
        result: 'Full referrer URLs may be shared.',
        what: 'Your website does not limit referrer information shared with external sites.',
        why: 'Full referrer URLs can expose sensitive query parameters to any site a visitor clicks through to.',
        fix: 'Add the header: Referrer-Policy: strict-origin-when-cross-origin',
        priority: 'Improvement',
      },
    },
  },
  {
    id: 'server-info',
    category: 'Browser Protection',
    name: 'Server Information Disclosure',
    weight: 5,
    variants: {
      pass: {
        severity: 'good',
        result: 'Server version information is hidden.',
        what: 'Your website does not expose detailed server or framework version numbers in its response headers.',
        why: 'Hiding version information makes it harder for attackers to target known vulnerabilities in specific software versions.',
        fix: 'No action needed.',
        priority: 'Maintained',
      },
      fail: {
        severity: 'low',
        result: 'Server version information is exposed.',
        what: 'Your website reveals server or framework version details in its response headers.',
        why: 'This helps attackers quickly identify known vulnerabilities that apply to your specific software versions.',
        fix: 'Configure your web server to suppress the Server and X-Powered-By headers.',
        priority: 'Improvement',
      },
    },
  },
];

const PRIORITY_ORDER = {
  'Fix immediately': 0,
  'Fix soon': 1,
  Recommended: 2,
  Improvement: 3,
  Maintained: 4,
};

const SEVERITY_RANK = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  good: 4,
};

function pickStatus(rand, weights) {
  const r = rand();
  let acc = 0;
  for (const [status, threshold] of weights) {
    acc += threshold;
    if (r < acc) return status;
  }
  return weights[weights.length - 1][0];
}

const STATUS_WEIGHTS = {
  https: [['pass', 0.82], ['fail', 1]],
  tls: [['pass', 0.8], ['warn', 1]],
  hsts: [['pass', 0.45], ['warn', 0.8], ['fail', 1]],
  csp: [['pass', 0.3], ['warn', 0.6], ['fail', 1]],
  'x-frame': [['pass', 0.6], ['fail', 1]],
  'x-content-type': [['pass', 0.55], ['fail', 1]],
  'referrer-policy': [['pass', 0.4], ['warn', 1]],
  'permissions-policy': [['pass', 0.35], ['warn', 1]],
  'cookie-secure': [['pass', 0.55], ['fail', 1]],
  'cookie-httponly': [['pass', 0.6], ['warn', 1]],
  'cookie-samesite': [['pass', 0.5], ['warn', 1]],
  coop: [['pass', 0.3], ['warn', 1]],
  coep: [['pass', 0.25], ['warn', 1]],
  corp: [['pass', 0.3], ['warn', 1]],
  'mime-sniff': [['pass', 0.55], ['fail', 1]],
  clickjacking: [['pass', 0.6], ['fail', 1]],
  'referrer-leak': [['pass', 0.4], ['warn', 1]],
  'server-info': [['pass', 0.5], ['fail', 1]],
};

function buildFindings(rand) {
  return FINDING_TEMPLATES.map((template) => {
    const status = pickStatus(rand, STATUS_WEIGHTS[template.id]);
    const variant = template.variants[status];
    return {
      id: template.id,
      category: template.category,
      name: template.name,
      weight: template.weight,
      status,
      severity: variant.severity,
      result: variant.result,
      what: variant.what,
      why: variant.why,
      fix: variant.fix,
      priority: variant.priority,
    };
  });
}

function computeScore(findings) {
  let earned = 0;
  let possible = 0;
  for (const f of findings) {
    possible += f.weight;
    if (f.status === 'pass') earned += f.weight;
    else if (f.status === 'warn') earned += f.weight * 0.5;
  }
  return Math.round((earned / possible) * 100);
}

function buildRecommendations(findings) {
  return findings
    .filter((f) => f.status !== 'pass')
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .map((f) => ({
      id: `rec-${f.id}`,
      findingId: f.id,
      title: f.name,
      text: f.fix,
      priority: f.priority,
      severity: f.severity,
    }));
}

export function generateDemoResults(url) {
  const normalized = normalizeUrl(url);
  const rand = seededRandom(normalized);
  const findings = buildFindings(rand);
  const score = computeScore(findings);

  const passed = findings.filter((f) => f.status === 'pass').length;
  const warnings = findings.filter((f) => f.status === 'warn').length;
  const issues = findings.filter((f) => f.status === 'fail').length;

  return {
    url: normalized,
    scannedAt: new Date().toISOString(),
    score,
    rating: getRatingLabel(score),
    ratingLevel: getRatingLevel(score),
    passed,
    warnings,
    issues,
    totalChecks: findings.length,
    critical: findings.filter((f) => f.severity === 'critical' && f.status !== 'pass').length,
    findings,
    recommendations: buildRecommendations(findings),
    categories: CATEGORIES,
  };
}

function normalizeUrl(url) {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function validateUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) {
    return { valid: false, message: 'Please enter a website URL to scan.' };
  }

  const withProtocol = normalizeUrl(trimmed);

  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return { valid: false, message: 'Please enter a valid domain (e.g. example.com).' };
    }
    return { valid: true, normalized: withProtocol };
  } catch {
    return { valid: false, message: 'Please enter a valid website URL.' };
  }
}

export function getRatingLevel(score) {
  if (score >= 80) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
}

export function getRatingLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Needs Improvement';
  return 'Critical';
}

export { SEVERITY_RANK };
