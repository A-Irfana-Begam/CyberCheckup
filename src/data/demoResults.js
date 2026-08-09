export function generateDemoResults(url) {
  const hostname = extractHostname(url);

  return {
    url: normalizeUrl(url),
    scannedAt: new Date().toISOString(),
    score: 72,
    rating: 'Good',
    ratingLevel: 'good',
    passed: 8,
    warnings: 3,
    issues: 2,
    checks: [
      {
        id: 'https',
        category: 'HTTPS Protection',
        title: 'HTTPS Enabled',
        status: 'pass',
        description: `${hostname} serves content over HTTPS with a valid TLS connection.`,
      },
      {
        id: 'cert-valid',
        category: 'HTTPS Protection',
        title: 'Valid SSL Certificate',
        status: 'pass',
        description: 'The SSL certificate is valid and not expired.',
      },
      {
        id: 'hsts',
        category: 'Security Headers',
        title: 'Strict-Transport-Security (HSTS)',
        status: 'warn',
        description: 'HSTS header is missing or has a short max-age value, leaving users vulnerable to downgrade attacks.',
      },
      {
        id: 'csp',
        category: 'Security Headers',
        title: 'Content-Security-Policy',
        status: 'fail',
        description: 'No Content-Security-Policy header detected. This increases risk of XSS and data injection attacks.',
      },
      {
        id: 'x-frame',
        category: 'Security Headers',
        title: 'X-Frame-Options',
        status: 'pass',
        description: 'X-Frame-Options is set to SAMEORIGIN, protecting against clickjacking.',
      },
      {
        id: 'x-content-type',
        category: 'Security Headers',
        title: 'X-Content-Type-Options',
        status: 'pass',
        description: 'X-Content-Type-Options is set to nosniff, preventing MIME-type sniffing.',
      },
      {
        id: 'cookie-secure',
        category: 'Cookie Security',
        title: 'Secure Cookie Flag',
        status: 'warn',
        description: 'Some cookies are missing the Secure flag and may be transmitted over unencrypted connections.',
      },
      {
        id: 'cookie-httponly',
        category: 'Cookie Security',
        title: 'HttpOnly Cookie Flag',
        status: 'pass',
        description: 'Session cookies use the HttpOnly flag, reducing XSS cookie theft risk.',
      },
      {
        id: 'cookie-samesite',
        category: 'Cookie Security',
        title: 'SameSite Cookie Attribute',
        status: 'warn',
        description: 'SameSite attribute is not set on all cookies, increasing CSRF exposure.',
      },
      {
        id: 'server-info',
        category: 'Security Configuration',
        title: 'Server Information Disclosure',
        status: 'fail',
        description: 'Server version information is exposed in response headers, aiding attacker reconnaissance.',
      },
      {
        id: 'referrer-policy',
        category: 'Security Configuration',
        title: 'Referrer-Policy',
        status: 'pass',
        description: 'Referrer-Policy is configured to limit referrer information leakage.',
      },
      {
        id: 'permissions-policy',
        category: 'Security Configuration',
        title: 'Permissions-Policy',
        status: 'pass',
        description: 'Permissions-Policy restricts access to sensitive browser features.',
      },
      {
        id: 'dnssec',
        category: 'Security Configuration',
        title: 'DNSSEC',
        status: 'pass',
        description: 'DNS records appear to be properly configured for the domain.',
      },
    ],
    recommendations: [
      {
        id: 'rec-csp',
        title: 'Implement Content-Security-Policy',
        text: 'Add a strict CSP header to mitigate cross-site scripting and unauthorized resource loading.',
        priority: 'high',
      },
      {
        id: 'rec-hsts',
        title: 'Enable HSTS with Long Max-Age',
        text: 'Set Strict-Transport-Security with a max-age of at least 31536000 (1 year) and includeSubDomains.',
        priority: 'high',
      },
      {
        id: 'rec-server',
        title: 'Remove Server Version Headers',
        text: 'Configure your web server to suppress version information in Server and X-Powered-By headers.',
        priority: 'medium',
      },
      {
        id: 'rec-cookies',
        title: 'Harden Cookie Attributes',
        text: 'Ensure all cookies use Secure, HttpOnly, and SameSite=Strict or Lax attributes.',
        priority: 'medium',
      },
    ],
  };
}

function extractHostname(url) {
  try {
    return new URL(normalizeUrl(url)).hostname;
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
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
