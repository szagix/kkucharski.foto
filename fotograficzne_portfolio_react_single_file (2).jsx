/*
  Fotograficzne Portfolio — Jednopliki komponent React (Tailwind CSS)
  ---------------------------------------------------------------
  Instrukcje:
  1. Skopiuj ten plik do swojego projektu React (np. src/components/Portfolio.jsx)
  2. Upewnij się, że masz Tailwind CSS skonfigurowany w projekcie. Jeśli nie — możesz
     użyć Vercel / Netlify + Create React App + Tailwind (szybkie deploy).
  3. Podmień obrazy w tablicy `PHOTOS` (zwróć uwagę na pola: src, title, desc).
     Możesz użyć lokalnego folderu /public/images lub linków bezpośrednich.
  4. Formularz kontaktowy domyślnie otwiera mailto. Możesz podłączyć formularz do
     Service (Formspree) lub własnego backendu.

  Co zawiera plik:
  - Nagłówek z prostą nawigacją
  - Sekcja hero z CTA
  - Galeria siatkowa (lazy loading, responsywna)
  - Lightbox/modal z możliwością przejścia strzałkami i zamykania Esc
  - Sekcja "O mnie" i kontakt
  - Proste SEO: meta title + description (jeśli umieścisz w <head>)

  Jeśli chcesz: mogę też wygenerować wersję statyczną HTML/CSS, dodać CMS
  (Netlify CMS, Sanity), albo podpiąć formularz — napisz, co preferujesz.
*/

import React, { useState, useEffect } from 'react';

// --- Podmień obrazy tutaj ---
const PHOTOS = [
  { id: 1, src: '/images/photo1.jpg', title: 'Portret — Miasto', desc: 'Sesja miejska, zmierzch' },
  { id: 2, src: '/images/photo2.jpg', title: 'Pejzaż — Góry', desc: 'Wschód słońca w górach' },
  { id: 3, src: '/images/photo3.jpg', title: 'Reportaż — Wydarzenie', desc: 'Chwile uchwycone podczas eventu' },
  { id: 4, src: '/images/photo4.jpg', title: 'Detale — Architektura', desc: 'Tekstury i linie' },
  { id: 5, src: '/images/photo5.jpg', title: 'Moda — Studio', desc: 'Minimalistyczna sesja studyjna' },
  { id: 6, src: '/images/photo6.jpg', title: 'Czarno-białe', desc: 'Kontrast i emocja' },
];

export default function Portfolio() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null); // photo id
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function onKey(e) {
      if (!selected) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, index]);

  const photos = PHOTOS.filter(p =>
    (p.title + ' ' + p.desc).toLowerCase().includes(query.toLowerCase())
  );

  function openModal(id) {
    const i = photos.findIndex(p => p.id === id);
    setIndex(i >= 0 ? i : 0);
    setSelected(photos[i >= 0 ? i : 0]);
  }

  function closeModal() {
    setSelected(null);
    setIndex(0);
  }

  function next() {
    const nextIndex = (index + 1) % photos.length;
    setIndex(nextIndex);
    setSelected(photos[nextIndex]);
  }

  function prev() {
    const prevIndex = (index - 1 + photos.length) % photos.length;
    setIndex(prevIndex);
    setSelected(photos[prevIndex]);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold">PF</div>
            <div>
              <h1 className="text-lg font-bold">Kacper Kucharski — Fotograf</h1>
              <p className="text-xs text-gray-500">Fotografia — portret | pejzaż | reportaż</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#gallery" className="hover:underline">Galeria</a>
            <a href="#about" className="hover:underline">O mnie</a>
            <a href="#contact" className="bg-black text-white px-4 py-2 rounded-md">Kontakt</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-extrabold">Opowiadam historie obrazem</h2>
          <p className="mt-4 text-gray-600">Profesjonalne sesje portretowe, reportaże wydarzeń i artystyczne pejzaże. Zobacz wybrane prace.</p>
          <div className="mt-6 flex gap-3">
            <a href="#gallery" className="px-5 py-3 bg-black text-white rounded-md">Zobacz galerię</a>
            <a href="#contact" className="px-5 py-3 border border-gray-300 rounded-md">Zamów sesję</a>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            <img src="/images/hero.jpg" alt="Hero" className="object-cover w-full h-full"/>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Galeria</h3>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Szukaj po tytule lub opisie..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-64"
            />
            <span className="text-sm text-gray-500">{photos.length} wyników</span>
          </div>
        </div>

        {photos.length === 0 ? (
          <p className="text-gray-500">Brak zdjęć pasujących do zapytania.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((p) => (
              <button key={p.id} onClick={() => openModal(p.id)} className="group relative overflow-hidden rounded-md bg-gray-100">
                <img
                  src={p.src}
                  alt={p.title}
                  loading="lazy"
                  className="object-cover w-full h-48 transform group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white">
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="text-xs text-gray-200">{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Modal / Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-4xl w-full relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-white text-xl">✕</button>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-2xl">‹</button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-2xl">›</button>
            <div className="bg-white rounded-md overflow-hidden">
              <img src={selected.src} alt={selected.title} className="w-full h-[60vh] object-contain bg-black" />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{selected.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{selected.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold">O mnie</h3>
            <p className="mt-4 text-gray-600">Jestem fotografem z zamiłowaniem do naturalnego światła i opowiadania historii poprzez obrazy. Specjalizuję się w sesjach portretowych, fotografii ślubnej i reportażu. Pracuję z klientami indywidualnymi oraz firmami.</p>
            <ul className="mt-4 text-sm space-y-2 text-gray-700">
              <li>📷 Doświadczenie: 8 lat</li>
              <li>🏆 Wyróżnienia: konkurs lokalny (2023)</li>
              <li>🌍 Dostępność: sesje w całej Polsce</li>
            </ul>
          </div>
          <div>
            <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
              <img src="/images/about.jpg" alt="O mnie" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white border rounded-md p-8">
          <h3 className="text-2xl font-bold">Kontakt</h3>
          <p className="mt-2 text-gray-600">Chcesz zarezerwować sesję lub zapytać o dostępność? Napisz:</p>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:twoj@email.com?subject=Zapytanie%20o%20sesj%C4%99&body=Hej,%20chcia%C5%82bym%20dowiedzie%C4%87%20si%C4%99...`; }}>
              <input type="text" placeholder="Twoje imię" required className="w-full border rounded-md px-3 py-2" />
              <input type="email" placeholder="Twój e-mail" required className="w-full border rounded-md px-3 py-2" />
              <textarea placeholder="Wiadomość" required className="w-full border rounded-md px-3 py-2 h-28"></textarea>
              <button type="submit" className="px-5 py-3 bg-black text-white rounded-md">Wyślij</button>
            </form>
            <div className="flex flex-col gap-4">
              <div>
                <strong>Email</strong>
                <div className="text-sm text-gray-600">twoj@email.com</div>
              </div>
              <div>
                <strong>Telefon</strong>
                <div className="text-sm text-gray-600">+48 600 000 000</div>
              </div>
              <div>
                <strong>Social</strong>
                <div className="flex gap-3 mt-2">
                  <a href="#" className="text-sm hover:underline">Instagram</a>
                  <a href="#" className="text-sm hover:underline">Behance</a>
                  <a href="#" className="text-sm hover:underline">Facebook</a>
                </div>
              </div>
              <div className="mt-auto text-xs text-gray-500">Uwaga: podmień dane kontaktowe w kodzie przed wdrożeniem.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-gray-600 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Kacper — Wszystkie prawa zastrzeżone</div>
          <div><a href="#" className="hover:underline">Polityka prywatności</a></div>
        </div>
      </footer>
    </div>
  );
}
