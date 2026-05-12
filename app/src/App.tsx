import './App.css'
import { Sparkles, ShoppingBag, Star, Truck, Heart, Wand2 } from 'lucide-react'

const featuredPacks = [
  {
    name: 'Cosmic Cuties',
    price: '$12',
    mood: 'Glitter astronauts, moon cats, and comet trails.',
    stickers: ['🚀', '🌙', '😺', '☄️'],
    accent: 'purple',
  },
  {
    name: 'Garden Giggles',
    price: '$9',
    mood: 'Happy snails, strawberries, tulips, and rainbows.',
    stickers: ['🐌', '🍓', '🌷', '🌈'],
    accent: 'green',
  },
  {
    name: 'Snack Attack',
    price: '$11',
    mood: 'Tiny food friends for laptops, bottles, and journals.',
    stickers: ['🍟', '🧃', '🍕', '🍩'],
    accent: 'orange',
  },
]

const categories = [
  {
    title: 'Planner sheets',
    description: 'Tiny icons and labels designed to brighten weekly spreads.',
    icon: '🗓️',
  },
  {
    title: 'Water bottle vinyls',
    description: 'Weatherproof stickers with glossy finishes and bold outlines.',
    icon: '💧',
  },
  {
    title: 'Mood packs',
    description: 'Emotion-themed mini characters for messages, notebooks, and gifts.',
    icon: '💌',
  },
  {
    title: 'Custom name tags',
    description: 'Personalized lettering with stars, clouds, bows, and sparkles.',
    icon: '✨',
  },
]

const testimonials = [
  {
    quote: 'My laptop looks like a tiny sticker parade now. I am obsessed.',
    name: 'Ariana, illustrator',
  },
  {
    quote: 'The vinyl quality is amazing, and the colors are even better in person.',
    name: 'Devon, journaling fan',
  },
  {
    quote: 'We ordered custom mascot stickers for our club and sold out in a day.',
    name: 'Mika, campus organizer',
  },
]

function App() {
  return (
    <div className="sticker-site">
      <header className="hero">
        <nav className="topbar">
          <div className="brand">
            <span className="brand-badge">✂️</span>
            <div>
              <p>Stickerverse</p>
              <span>cute vinyls & happy paper goods</span>
            </div>
          </div>
          <div className="nav-links">
            <a href="#packs">Packs</a>
            <a href="#custom">Custom</a>
            <a href="#reviews">Reviews</a>
            <button type="button">Shop now</button>
          </div>
        </nav>

        <section className="hero-content">
          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={16} />
              Tiny art with giant personality
            </span>
            <h1>A joyful sticker shop for laptops, journals, and every blank corner.</h1>
            <p>
              Browse glossy vinyl packs, planner sheets, and custom sticker drops made to
              turn everyday stuff into colorful little keepsakes.
            </p>
            <div className="hero-actions">
              <a href="#packs" className="primary-link">
                Explore sticker packs
              </a>
              <a href="#custom" className="secondary-link">
                Design your own
              </a>
            </div>
            <ul className="hero-stats">
              <li>
                <strong>150+</strong>
                bestselling designs
              </li>
              <li>
                <strong>48h</strong>
                custom proof turnaround
              </li>
              <li>
                <strong>4.9/5</strong>
                average happiness rating
              </li>
            </ul>
          </div>

          <div className="hero-art">
            <div className="sticker-board">
              <div className="sticker large rotate-left">🦄</div>
              <div className="sticker medium rotate-right">🌼</div>
              <div className="sticker small">🛹</div>
              <div className="sticker medium rotate-left">🧸</div>
              <div className="sticker large rotate-right">🪩</div>
              <div className="sticker medium">🍒</div>
            </div>
            <div className="floating-note">
              <Heart size={18} />
              kiss-cut, waterproof, and packed with confetti vibes
            </div>
          </div>
        </section>
      </header>

      <main>
        <section className="feature-strip">
          <article>
            <Truck size={20} />
            <div>
              <h2>Fast shipping</h2>
              <p>Orders ship in 1–3 days with protective packaging.</p>
            </div>
          </article>
          <article>
            <Star size={20} />
            <div>
              <h2>Premium finish</h2>
              <p>Durable matte and glossy laminates built for everyday use.</p>
            </div>
          </article>
          <article>
            <ShoppingBag size={20} />
            <div>
              <h2>Collector bundles</h2>
              <p>Seasonal drops, minis, and surprise freebies in every bundle.</p>
            </div>
          </article>
        </section>

        <section className="section" id="packs">
          <div className="section-heading">
            <span>Featured packs</span>
            <h2>Pick a mood, peel a sticker, repeat.</h2>
          </div>
          <div className="pack-grid">
            {featuredPacks.map((pack) => (
              <article key={pack.name} className={`pack-card ${pack.accent}`}>
                <div className="pack-top">
                  <span className="price-pill">{pack.price}</span>
                  <div className="sticker-row" aria-hidden="true">
                    {pack.stickers.map((sticker) => (
                      <span key={sticker}>{sticker}</span>
                    ))}
                  </div>
                </div>
                <h3>{pack.name}</h3>
                <p>{pack.mood}</p>
                <button type="button">Add to cart</button>
              </article>
            ))}
          </div>
        </section>

        <section className="section split-layout">
          <div className="section-heading narrow">
            <span>Sticker styles</span>
            <h2>From planner minis to bold vinyl decals.</h2>
            <p>
              Every collection is illustrated with playful colors, thick cut lines, and a
              mix of nostalgic and modern character design.
            </p>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <article key={category.title} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section custom-section" id="custom">
          <div className="custom-copy">
            <span>
              <Wand2 size={16} /> Custom sticker studio
            </span>
            <h2>Need stickers for your brand, event, or chaotic little inside joke?</h2>
            <p>
              Send a sketch, logo, or idea and we will turn it into a polished proof with
              finish recommendations, size options, and bundle pricing.
            </p>
            <ul>
              <li>Single die-cut stickers and full sheets</li>
              <li>Holographic, transparent, matte, and glitter options</li>
              <li>Launch kits for creators, clubs, and small shops</li>
            </ul>
          </div>
          <div className="custom-card">
            <h3>Most requested custom sets</h3>
            <div className="request-list">
              <div>
                <strong>Creator merch packs</strong>
                <span>For artists, streamers, and makers</span>
              </div>
              <div>
                <strong>Event favor stickers</strong>
                <span>Weddings, birthdays, and pop-up tables</span>
              </div>
              <div>
                <strong>Brand mascot sheets</strong>
                <span>Mini characters for thank-you cards and packaging</span>
              </div>
            </div>
            <button type="button">Start a custom order</button>
          </div>
        </section>

        <section className="section testimonials" id="reviews">
          <div className="section-heading">
            <span>Happy collectors</span>
            <h2>Little reviews from very enthusiastic sticker people.</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.name}>
                <p>“{testimonial.quote}”</p>
                <footer>{testimonial.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
