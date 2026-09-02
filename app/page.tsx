import Link from "next/link";

function Icon({ path }: { path: string }) {
  return (
    <svg
      className="lp-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

const icons = {
  clock: "M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  target:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  message:
    "M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.2 0-2.34-.27-3.36-.75L3 20l1.02-4.08A8.5 8.5 0 1 1 21 11.5Z",
  spark:
    "M12 3v4M12 17v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M3 12h4M17 12h4M4.2 19.8 7 17M17 7l2.8-2.8",
  send: "M21 3 3 10.5l7 2.5m11-10-4 17-7-6.5m11-10L10 13",
  calendar:
    "M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
};

function DashboardMockup({ large = false }: { large?: boolean }) {
  return (
    <div className={large ? "lp-mockup lp-mockup-lg" : "lp-mockup"}>
      <div className="lp-mockup-header">
        <span className="badge">Zappivot</span>
        <strong>Sales Dashboard</strong>
      </div>

      <div className="lp-mockup-stats">
        <div className="stat">
          <strong>24</strong>
          <span>Toplam Lead</span>
        </div>
        <div className="stat">
          <strong>5</strong>
          <span>Bugün Takip</span>
        </div>
        <div className="stat">
          <strong>8</strong>
          <span>Yüksek Skor</span>
        </div>
        <div className="stat">
          <strong>2</strong>
          <span>Geciken</span>
        </div>
      </div>

      <div className="lead-list lp-mockup-leads">
        <div className="lead">
          <div>
            <strong>Ahmet Yılmaz</strong>
            <span>AI Score 92</span>
          </div>
          <div className="lead-right">
            <span className="followup-badge today">Bugün</span>
          </div>
        </div>

        <div className="lead">
          <div>
            <strong>Mehmet Kaya</strong>
            <span>AI Score 81</span>
          </div>
          <div className="lead-right">
            <span className="followup-badge upcoming">Yarın</span>
          </div>
        </div>

        {large && (
          <div className="lead">
            <div>
              <strong>Zeynep Aydın</strong>
              <span>AI Score 74</span>
            </div>
            <div className="lead-right">
              <span className="followup-badge overdue">Gecikti</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="lp-page">
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <span className="lp-brand">Zappivot</span>

          <div className="lp-nav-links">
            <a href="#cozum">Özellikler</a>
            <a href="#nasil-calisir">Nasıl Çalışır?</a>
            <a href="#cta">Fiyatlandırma</a>
          </div>

          <div className="lp-nav-actions">
            <Link href="/login" className="lp-link-btn">
              Giriş Yap
            </Link>
            <Link href="/register" className="btn">
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </nav>

      <section className="lp-hero">
        <div className="lp-hero-text">
          <span className="badge">AI Destekli Satış Takibi</span>

          <h1 className="lp-hero-title">
            Teklif gönderdiğin müşterileri kaybetme.
          </h1>

          <p className="lp-hero-subtitle">
            Zappivot, lead'lerini AI ile analiz eder, satın alma ihtimalini
            puanlar ve her müşteri için kişiselleştirilmiş follow-up
            mesajları oluşturur.
          </p>

          <div className="lp-hero-actions">
            <Link href="/register" className="btn lp-btn-lg">
              Ücretsiz Başla
            </Link>
            <Link href="/login" className="lp-link-btn lp-link-btn-lg">
              Giriş Yap
            </Link>
          </div>
        </div>

        <div className="lp-hero-mockup">
          <DashboardMockup />
        </div>
      </section>

      <section className="lp-section">
        <h2 className="lp-section-title">
          İyi lead'ler çoğu zaman satış yapılmadığı için değil, takip
          edilmediği için kaybolur.
        </h2>

        <div className="lp-grid-3">
          <div className="card lp-card">
            <Icon path={icons.clock} />
            <h3>Takip unutuluyor</h3>
            <p>
              Hangi müşteriye ne zaman dönmen gerektiğini hatırlamak zor.
            </p>
          </div>

          <div className="card lp-card">
            <Icon path={icons.target} />
            <h3>Öncelik belli değil</h3>
            <p>Hangi lead'in gerçekten değerli olduğunu anlamak zor.</p>
          </div>

          <div className="card lp-card">
            <Icon path={icons.message} />
            <h3>Herkese aynı mesaj</h3>
            <p>
              Genel follow-up mesajları müşterinin ilgisini yeniden çekmekte
              yetersiz kalıyor.
            </p>
          </div>
        </div>
      </section>

      <section id="cozum" className="lp-section">
        <h2 className="lp-section-title">
          Zappivot satış takibini otomatikleştirir.
        </h2>

        <div className="lp-grid-4">
          <div className="card lp-card">
            <Icon path={icons.spark} />
            <h3>AI Lead Score</h3>
            <p>
              Claude her lead'i puanlar, sıcak/ılık/soğuk olarak
              sınıflandırır.
            </p>
          </div>

          <div className="card lp-card">
            <Icon path={icons.send} />
            <h3>AI Follow-Up</h3>
            <p>
              Her lead için kişiselleştirilmiş, gönderilmeye hazır takip
              mesajları oluşturur.
            </p>
          </div>

          <div className="card lp-card">
            <Icon path={icons.calendar} />
            <h3>Takip Tarihleri</h3>
            <p>
              Her lead için takip tarihi belirle, hiçbir fırsatı kaçırma.
            </p>
          </div>

          <div className="card lp-card">
            <Icon path={icons.grid} />
            <h3>Lead Yönetimi</h3>
            <p>
              Tüm lead'lerini tek panelden yönet, filtrele ve
              önceliklendir.
            </p>
          </div>
        </div>
      </section>

      <section className="lp-section lp-preview-section">
        <h2 className="lp-section-title">
          Satış pipeline'ını tek bakışta gör.
        </h2>

        <div className="lp-preview-mockup">
          <DashboardMockup large />
        </div>
      </section>

      <section id="nasil-calisir" className="lp-section">
        <h2 className="lp-section-title">Nasıl çalışır?</h2>

        <div className="lp-grid-4">
          <div className="lp-step">
            <span className="lp-step-number">01</span>
            <h3>Lead'i ekle</h3>
            <p>Müşteri bilgilerini ve konuşma özetini gir.</p>
          </div>

          <div className="lp-step">
            <span className="lp-step-number">02</span>
            <h3>AI analiz etsin</h3>
            <p>Claude, lead'i puanlar ve satın alma ihtimalini değerlendirir.</p>
          </div>

          <div className="lp-step">
            <span className="lp-step-number">03</span>
            <h3>Follow-up oluştur</h3>
            <p>Kişiselleştirilmiş, gönderilmeye hazır bir mesaj üretilir.</p>
          </div>

          <div className="lp-step">
            <span className="lp-step-number">04</span>
            <h3>Doğru zamanda takip et</h3>
            <p>Takip tarihini belirle, hiçbir fırsatı kaçırma.</p>
          </div>
        </div>
      </section>

      <section id="cta" className="lp-cta">
        <h2 className="lp-section-title">
          Bir sonraki satış fırsatını kaçırma.
        </h2>

        <p className="lp-cta-subtitle">
          Lead'lerini yönet, doğru müşteriye doğru zamanda ulaş ve satış
          sürecini AI ile hızlandır.
        </p>

        <Link href="/register" className="btn lp-btn-lg">
          Ücretsiz Başla
        </Link>
      </section>

      <footer className="lp-footer">
        <span className="lp-brand">Zappivot</span>
        <p>AI destekli satış takip platformu.</p>
      </footer>
    </main>
  );
}
