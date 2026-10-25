const links = [
  { href: "#the-idea", label: "The idea" },
  { href: "#in-hand", label: "In the hand" },
  { href: "#the-moment", label: "The experience" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Still, back to top"><span className="wordmark__aperture" aria-hidden="true" /><span>still<span className="wordmark__period">.</span></span></a>
      <nav aria-label="Main navigation" className="site-nav">
        {links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}
      </nav>
      <a className="header-index" href="#the-moment">Explore the concept <span aria-hidden="true">↗</span></a>
    </header>
  );
}
