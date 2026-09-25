import { ArrowLeft } from '../components/Icons';
import { Link } from '../lib/router';
import { usePageMeta } from '../lib/meta';

export default function NotFound() {
  usePageMeta('404 — Signal lost · Aditya');
  return (
    <section className="container notfound" aria-labelledby="nf-title">
      <p className="label label--lime">Error 404</p>
      <h1 id="nf-title">
        Signal
        <br />
        lost<span className="notfound__dot">.</span>
      </h1>
      <p>There’s nothing at this address. The rest of the system is fine.</p>
      <Link href="/" className="btn btn--primary">
        <ArrowLeft /> Back to base
      </Link>
    </section>
  );
}
