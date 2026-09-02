import Link from "next/link";

function DashboardMockup() {
  return (
    <div className="lp-mockup">
      <div className="lp-mockup-header">
        <span className="badge">AI Lead Follow-Up · MVP</span>
        <strong>Lead Dashboard</strong>
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
            <Link href="/register" className="btn lp-btn-sm">
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
            <Link href="/register" className="btn">
              Ücretsiz Başla
            </Link>
            <Link href="/login" className="lp-link-btn">
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
            <h3>Takip unutuluyor</h3>
            <p>
              Hangi müşteriye ne zaman dönmen gerektiğini hatırlamak zor.
            </p>
          </div>

          <div className="card lp-card">
            <h3>Öncelik belli değil</h3>
            <p>Hangi lead'in gerçekten değerli olduğunu anlamak zor.</p>
          </div>

          <div className="card lp-card">
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
            <h3>AI Lead Score</h3>
            <p>
              Claude her lead'i puanlar, sıcak/ılık/soğuk olarak
              sınıflandırır.
            </p>
          </div>

          <div className="card lp-card">
            <h3>AI Follow-Up</h3>
            <p>
              Her lead için kişiselleştirilmiş, gönderilmeye hazır takip
              mesajları oluşturur.
            </p>
          </div>

          <div className="card lp-card">
            <h3>Takip Tarihleri</h3>
            <p>
              Her lead için takip tarihi belirle, hiçbir fırsatı kaçırma.
            </p>
          </div>

          <div className="card lp-card">
            <h3>Lead Yönetimi</h3>
            <p>
              Tüm lead'lerini tek panelden yönet, filtrele ve
              önceliklendir.
            </p>
          </div>
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

      <section className="lp-section">
        <h2 className="lp-section-title">Panelinden tek bakışta gör.</h2>

        <div className="lp-preview-mockup">
          <DashboardMockup />
        </div>
      </section>

      <section id="cta" className="lp-cta">
        <h2 className="lp-section-title">
          Bir sonraki satış fırsatını kaçırma.
        </h2>

        <Link href="/register" className="btn">
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
