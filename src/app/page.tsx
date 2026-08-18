'use client';

import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSent(false);

    const form = new FormData(e.currentTarget);

    const payload = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      company: String(form.get('company') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      message: String(form.get('message') || '').trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.error || 'Failed to send your inquiry.'
        );
      }

      setSent(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while sending your inquiry.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="shell">
        <section className="hero">
          <div className="eyebrow">
            <Sparkles size={14} />
            NORTHSTAR DIGITAL
          </div>

          <h1>
            Have a business problem?
            <br />
            <span>Let’s build the right system.</span>
          </h1>

          <p className="heroText">
            Tell us what you’re trying to improve. We’ll review your
            request and get back to you with a practical next step.
          </p>

          <div className="trust">
            <span>
              <Clock3 size={15} />
              Usually replies within one business day
            </span>

            <span>•</span>

            <span>Simple. No sales spam.</span>
          </div>
        </section>

        <section className="card">
          {sent ? (
            <div className="success">
              <CheckCircle2 size={48} />

              <h2>Thanks — we got it.</h2>

              <p>
                Your request has been sent to our team.
                We’ll be in touch shortly.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setError('');
                }}
              >
                Send another request
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="formHeader">
                <div>
                  <h2>Tell us about your project</h2>

                  <p>
                    Just the basics. You can keep it conversational.
                  </p>
                </div>

                <span className="required">
                  * Required
                </span>
              </div>

              <div className="grid">
                <label>
                  Name *

                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Jane Smith"
                  />
                </label>

                <label>
                  Work email *

                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="jane@company.com"
                  />
                </label>

                <label>
                  Company *

                  <input
                    name="company"
                    required
                    autoComplete="organization"
                    placeholder="Acme Inc."
                  />
                </label>

                <label>
                  Phone

                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 555 123 4567"
                  />
                </label>
              </div>

              <label>
                What are you trying to solve? *

                <textarea
                  name="message"
                  required
                  minLength={10}
                  rows={6}
                  placeholder="We currently manage leads in spreadsheets and want a CRM with automated follow-ups..."
                />
              </label>

              {error && (
                <div className="error" role="alert">
                  {error}
                </div>
              )}

              <button
                className="submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  'Sending…'
                ) : (
                  <>
                    Send inquiry
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="fine">
                By submitting, you agree that we can use these
                details to respond to your inquiry.
              </p>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}