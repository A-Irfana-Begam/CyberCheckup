const STEPS = [
  {
    number: 1,
    title: 'Enter Website',
    description: 'Provide your website URL — no login or credentials needed.',
  },
  {
    number: 2,
    title: 'Analyze Security',
    description: 'Our scanner performs a non-invasive review of your security posture.',
  },
  {
    number: 3,
    title: 'Understand Results',
    description: 'Get a clear score, rating, and breakdown of passed checks and issues.',
  },
  {
    number: 4,
    title: 'Improve Protection',
    description: 'Follow actionable recommendations to strengthen your defenses.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section" aria-labelledby="how-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Process</span>
          <h2 id="how-heading" className="section-title">
            How It Works
          </h2>
          <p className="section-description">
            Four simple steps to understand and improve your website&apos;s security health.
          </p>
        </div>

        <div className="how-it-works__steps">
          {STEPS.map(({ number, title, description }) => (
            <article key={number} className="step-card">
              <div className="step-card__number" aria-hidden="true">
                {number}
              </div>
              <div>
                <h3 className="step-card__title">{title}</h3>
                <p className="step-card__description">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
