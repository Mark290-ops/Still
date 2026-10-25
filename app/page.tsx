import ImageFrame from "@/components/ImageFrame";
import CameraHeroMedia from "@/components/CameraHeroMedia";
import AfterMomentSequence from "@/components/AfterMomentSequence";
import SiteHeader from "@/components/SiteHeader";
import ProductPage from "@/components/ProductPage";
import ScrollProgress from "@/components/ScrollProgress";
import IdeaIntroSequence from "@/components/IdeaIntroSequence";
import ObjectOpening from "@/components/ObjectOpening";
import { media } from "@/lib/content";

export default function Home() {
  return (
    <main id="top">
      <ScrollProgress />
      <SiteHeader />

      <svg className="hero-clip-definitions" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="camera-hero-desktop" clipPathUnits="objectBoundingBox">
            <path d="M .52 0 H .96 Q 1 0 1 .075 V .56 C 1 .625 .98 .6475 .94 .70 L .78 .91 C .756 .9415 .72 1 .68 1 H .04 Q 0 1 0 .96 V .55 Q 0 .48 .04 .48 H .3525 C .358 .48 .3649 .4719 .36696 .46651 L .46304 .21349 C .4651 .2081 .47 .1865 .47 .1811 V .075 Q .47 0 .52 0 Z" />
          </clipPath>
          <clipPath id="camera-hero-tablet" clipPathUnits="objectBoundingBox">
            <path d="M .52 0 H .96 Q 1 0 1 .075 V .56 C 1 .625 .98 .6475 .94 .70 L .78 .91 C .756 .9415 .72 1 .68 1 H .04 Q 0 1 0 .96 V .60 Q 0 .53 .04 .53 H .3462 C .3525 .53 .3641 .519 .3664 .513 L .46738 .24693 C .46964 .24093 .47 .23817 .47 .23217 V .075 Q .47 0 .52 0 Z" />
          </clipPath>
        </defs>
      </svg>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <div className="hero__title-row">
            <h1 id="hero-title">Keep Still.</h1>
            <p className="hero__vertical-wordmark" lang="de" aria-label="Stille">Stille</p>
          </div>
          <div className="hero__details">
            <div className="hero__thumb">
              <ImageFrame src={media.heroThumbCamera.src} alt={media.heroThumbCamera.alt} className="hero__thumb-image" imageClassName="hero__thumb-photo" sizes="(max-width: 700px) 28vw, 10vw" />
            </div>
            <div className="hero__description">
              <p className="hero__description-copy">A quieter way to make a photograph—and stay where you are.</p>
              <div className="hero__buttons">
                <a className="hero__button hero__button--primary" href="#the-idea">Meet the idea <span aria-hidden="true">↘</span></a>
                <a className="hero__button hero__button--secondary" href="#in-hand">The object <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__visual hero__visual--camera">
          <CameraHeroMedia
            src={media.cameraVideo}
            poster={media.cameraPoster}
            alt="Hands operating a compact vintage camera in soft studio light."
            posterAlt="A close view of a vintage camera being operated by hand."
          />
        </div>

        <div className="hero__note">
          <p className="hero__note-copy">“Stay with<br /><span>the moment”</span></p>
        </div>
      </section>

      <IdeaIntroSequence />

      <ObjectOpening />

      <ProductPage />

      <AfterMomentSequence />

      <footer className="closing" aria-labelledby="closing-title">
        <div className="closing__texture" aria-hidden="true" />
        <div className="closing__title-row">
          <h2 id="closing-title">Come back<br />to the moment.</h2>
          <p className="closing__side-mark">Keep Still</p>
        </div>
        <a href="#top" className="closing__link">Snap back to start <span aria-hidden="true">↑</span></a>
        <div className="closing__socials" role="group" aria-label="Social media placeholders">
          <span className="closing__social" role="img" aria-label="TikTok placeholder">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 3v11.1a4.1 4.1 0 1 1-3.5-4.05v3.15a1.2 1.2 0 1 0 .5 1V3h3Zm0 0c.4 2.4 1.8 3.8 4.3 4.1v3.1a8.2 8.2 0 0 1-4.3-1.7" /></svg>
          </span>
          <span className="closing__social" role="img" aria-label="Instagram placeholder">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle className="closing__social-dot" cx="17.7" cy="6.8" r=".9" /></svg>
          </span>
          <span className="closing__social" role="img" aria-label="X placeholder">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 3 16 18M20 3 4 21M7.5 3h4l5 6.1M12.5 14.9l4 6.1h-4l-5-6.1" /></svg>
          </span>
          <span className="closing__social" role="img" aria-label="WhatsApp placeholder">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3.5 20l1.2-4.4a8.2 8.2 0 1 1 15.5-3.9Z" /><path d="M8.5 8.1c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.3.1.5-.1.7l-.5.6c-.2.2-.2.4-.1.6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.7-.8c.2-.2.4-.3.7-.2l1.6.8c.3.1.4.3.4.5 0 .3-.2 1.1-.8 1.5-.5.4-1.1.6-1.8.4-1-.2-2.3-.8-3.6-2-1.1-1-2-2.4-2.2-3.4-.2-.8 0-1.5.4-2.3Z" /></svg>
          </span>
        </div>
      </footer>
    </main>
  );
}
