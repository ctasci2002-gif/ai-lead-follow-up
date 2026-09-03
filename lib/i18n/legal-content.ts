export type LegalSection = { heading: string; body: string };
export type LegalContent = { intro: string; sections: LegalSection[]; contact: string };

const emailLine = "ctasci2002@gmail.com";

export const privacyContent: Record<string, LegalContent> = {
  en: {
    intro:
      'Zappivot ("we", "us") provides an AI-powered prospecting and outreach platform for agencies at zappivot.com. This page explains what data we collect, why, and how it\'s handled.',
    sections: [
      {
        heading: "1. Information we collect",
        body: "Account information: your email address, and if you sign in with Google, the name and profile details Google shares with us for authentication. Content you provide: lead and prospect search criteria (industry, location, company size), and any leads or notes you add manually. Data we generate for you: AI-produced company research, qualification scores, and draft outreach messages, built from public web sources and the inputs above.",
      },
      {
        heading: "2. How we use your information",
        body: "We use your data solely to operate Zappivot for you: running searches, generating AI analysis and outreach drafts, sending the emails you explicitly approve, and keeping your account and dashboard working. We do not sell your data.",
      },
      {
        heading: "3. Third-party services we rely on",
        body: "Zappivot is built on a small set of infrastructure providers, each processing data only as needed to power the corresponding feature: Supabase (authentication and database storage), Anthropic/Claude (AI analysis, scoring, and outreach generation), Tavily (web search for the Prospect Finder), Resend (delivery of outreach emails and account notifications), and Vercel (application hosting).",
      },
      {
        heading: "4. Outreach and third-party contacts",
        body: "When you use the AI Marketing Agent, Zappivot only sends an email after you personally review and approve it. We never send outreach automatically. Recipient contact details are only ever ones found verifiably in public search results — Zappivot does not guess or fabricate an email address.",
      },
      {
        heading: "5. Data retention and deletion",
        body: "We keep your account data for as long as your account is active. You can request deletion of your account and associated data at any time by contacting us at the email below.",
      },
      {
        heading: "6. Cookies",
        body: "Zappivot uses a session cookie strictly to keep you signed in, and a language-preference cookie to remember your chosen interface language. We do not use advertising or tracking cookies.",
      },
      {
        heading: "7. Your rights",
        body: "You can access, correct, or delete your data at any time from within the app, or by contacting us directly.",
      },
    ],
    contact: "Questions about this policy? Email",
  },
  tr: {
    intro:
      'Zappivot ("biz"), zappivot.com adresinde ajanslar için AI destekli bir prospecting ve outreach platformu sunar. Bu sayfa hangi verileri, neden ve nasıl işlediğimizi açıklar.',
    sections: [
      {
        heading: "1. Topladığımız bilgiler",
        body: "Hesap bilgileri: e-posta adresin, ve Google ile giriş yaparsan, Google'ın kimlik doğrulama için bizimle paylaştığı ad ve profil bilgileri. Sağladığın içerik: lead ve prospect arama kriterleri (sektör, konum, şirket büyüklüğü) ve manuel eklediğin lead veya notlar. Senin için oluşturduğumuz veri: kamuya açık web kaynaklarından ve yukarıdaki girdilerden üretilen AI şirket araştırması, niteleme skorları ve taslak outreach mesajları.",
      },
      {
        heading: "2. Bilgilerini nasıl kullanıyoruz",
        body: "Verilerini sadece Zappivot'u senin için çalıştırmak amacıyla kullanırız: aramalar yapmak, AI analizi ve outreach taslakları oluşturmak, açıkça onayladığın e-postaları göndermek ve hesabını/panelini çalışır tutmak. Verilerini asla satmayız.",
      },
      {
        heading: "3. Dayandığımız üçüncü taraf hizmetler",
        body: "Zappivot, her biri sadece ilgili özelliği çalıştırmak için gereken veriyi işleyen küçük bir altyapı sağlayıcı grubu üzerine kuruludur: Supabase (kimlik doğrulama ve veritabanı), Anthropic/Claude (AI analiz, puanlama ve outreach üretimi), Tavily (Prospect Finder için web araması), Resend (outreach e-postaları ve hesap bildirimlerinin gönderimi) ve Vercel (uygulama barındırma).",
      },
      {
        heading: "4. Outreach ve üçüncü taraf iletişim bilgileri",
        body: "AI Marketing Agent'ı kullandığında, Zappivot bir e-postayı sadece sen kişisel olarak gözden geçirip onayladıktan sonra gönderir. Outreach'i asla otomatik olarak göndermeyiz. Alıcı iletişim bilgileri sadece kamuya açık arama sonuçlarında doğrulanabilir şekilde bulunanlardır — Zappivot bir e-posta adresini asla tahmin etmez veya uydurmaz.",
      },
      {
        heading: "5. Veri saklama ve silme",
        body: "Hesap verilerini hesabın aktif olduğu sürece saklarız. Aşağıdaki e-postadan bizimle iletişime geçerek hesabının ve ilişkili verilerin silinmesini istediğin zaman talep edebilirsin.",
      },
      {
        heading: "6. Çerezler",
        body: "Zappivot, seni oturumda tutmak için kesinlikle gerekli bir oturum çerezi ve seçtiğin arayüz dilini hatırlamak için bir dil tercihi çerezi kullanır. Reklam veya takip çerezi kullanmıyoruz.",
      },
      {
        heading: "7. Hakların",
        body: "Verilerine uygulama içinden veya doğrudan bizimle iletişime geçerek istediğin zaman erişebilir, düzeltebilir veya silebilirsin.",
      },
    ],
    contact: "Bu politika hakkında sorun mu var? E-posta:",
  },
  de: {
    intro:
      'Zappivot ("wir") bietet auf zappivot.com eine AI-gestützte Prospecting- und Outreach-Plattform für Agenturen. Diese Seite erklärt, welche Daten wir sammeln, warum, und wie sie verarbeitet werden.',
    sections: [
      {
        heading: "1. Informationen, die wir sammeln",
        body: "Kontoinformationen: deine E-Mail-Adresse und, falls du dich mit Google anmeldest, die Namens- und Profildaten, die Google zur Authentifizierung mit uns teilt. Von dir bereitgestellte Inhalte: Lead- und Prospect-Suchkriterien (Branche, Standort, Unternehmensgröße) sowie manuell hinzugefügte Leads oder Notizen. Für dich erstellte Daten: AI-generierte Unternehmensrecherche, Qualifizierungs-Scores und Outreach-Entwürfe, basierend auf öffentlichen Webquellen und den obigen Eingaben.",
      },
      {
        heading: "2. Wie wir deine Informationen nutzen",
        body: "Wir nutzen deine Daten ausschließlich, um Zappivot für dich zu betreiben: Suchen durchführen, AI-Analysen und Outreach-Entwürfe erstellen, die von dir ausdrücklich genehmigten E-Mails senden und dein Konto und Dashboard funktionsfähig halten. Wir verkaufen deine Daten nicht.",
      },
      {
        heading: "3. Drittanbieter, auf die wir uns verlassen",
        body: "Zappivot basiert auf einer kleinen Gruppe von Infrastrukturanbietern, die jeweils nur die für die entsprechende Funktion nötigen Daten verarbeiten: Supabase (Authentifizierung und Datenbank), Anthropic/Claude (AI-Analyse, Scoring und Outreach-Erstellung), Tavily (Websuche für den Prospect Finder), Resend (Versand von Outreach-E-Mails und Kontobenachrichtigungen) und Vercel (Hosting der Anwendung).",
      },
      {
        heading: "4. Outreach und Kontakte Dritter",
        body: "Wenn du den AI Marketing Agent nutzt, sendet Zappivot eine E-Mail erst, nachdem du sie persönlich geprüft und genehmigt hast. Wir versenden Outreach niemals automatisch. Empfänger-Kontaktdaten stammen ausschließlich aus öffentlich verifizierbaren Suchergebnissen — Zappivot rät oder erfindet niemals eine E-Mail-Adresse.",
      },
      {
        heading: "5. Datenspeicherung und Löschung",
        body: "Wir speichern deine Kontodaten, solange dein Konto aktiv ist. Du kannst jederzeit die Löschung deines Kontos und der zugehörigen Daten beantragen, indem du uns unter der unten stehenden E-Mail-Adresse kontaktierst.",
      },
      {
        heading: "6. Cookies",
        body: "Zappivot verwendet ein Session-Cookie ausschließlich, um dich angemeldet zu halten, sowie ein Sprachpräferenz-Cookie, um deine gewählte Oberflächensprache zu merken. Wir verwenden keine Werbe- oder Tracking-Cookies.",
      },
      {
        heading: "7. Deine Rechte",
        body: "Du kannst jederzeit über die App oder durch direkten Kontakt mit uns auf deine Daten zugreifen, sie korrigieren oder löschen.",
      },
    ],
    contact: "Fragen zu dieser Richtlinie? E-Mail:",
  },
};

export const termsContent: Record<string, LegalContent> = {
  en: {
    intro:
      "These terms govern your use of Zappivot at zappivot.com. By creating an account, you agree to them.",
    sections: [
      {
        heading: "1. The service",
        body: "Zappivot helps agencies discover prospect companies, research decision-makers, and draft personalized outreach using AI. AI outputs (company research, scores, draft emails) are generated from publicly available sources and the criteria you provide — they can be incomplete or inaccurate, and you're responsible for reviewing anything before you act on it or send it.",
      },
      {
        heading: "2. Your account",
        body: "You're responsible for keeping your login credentials secure and for all activity under your account. You must provide an accurate email address.",
      },
      {
        heading: "3. Acceptable use",
        body: "You agree not to: use Zappivot to send unsolicited, deceptive, or unlawful messages, or otherwise violate applicable anti-spam laws; attempt to circumvent the daily usage limits or the human-approval step required before any outreach email is sent; use the service to collect or process data on individuals in a way that violates their legal rights; misuse, disrupt, or attempt unauthorized access to Zappivot or its underlying infrastructure.",
      },
      {
        heading: "4. No automatic sending",
        body: "Zappivot never sends an outreach email without your explicit, per-message approval. You are solely responsible for the content and recipients of any email you approve and send.",
      },
      {
        heading: "5. Plans and limits",
        body: "Zappivot currently offers a Free plan with daily usage limits. Paid plans are not yet available; pricing shown on the site is provisional and may change before launch.",
      },
      {
        heading: "6. Disclaimer and limitation of liability",
        body: 'Zappivot is provided "as is", without warranties of any kind. To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the service, including outcomes of outreach you choose to send.',
      },
      {
        heading: "7. Termination",
        body: "You may stop using Zappivot and request account deletion at any time. We may suspend or terminate accounts that violate these terms.",
      },
      {
        heading: "8. Changes",
        body: "We may update these terms as the product evolves. Continued use of Zappivot after a change means you accept the updated terms.",
      },
    ],
    contact: "Questions about these terms? Email",
  },
  tr: {
    intro:
      "Bu şartlar, zappivot.com adresindeki Zappivot kullanımını düzenler. Hesap oluşturarak bunları kabul etmiş olursun.",
    sections: [
      {
        heading: "1. Hizmet",
        body: "Zappivot, ajansların AI kullanarak prospect şirketler keşfetmesine, karar vericileri araştırmasına ve kişiselleştirilmiş outreach taslakları hazırlamasına yardımcı olur. AI çıktıları (şirket araştırması, skorlar, taslak e-postalar) kamuya açık kaynaklardan ve senin sağladığın kriterlerden üretilir — eksik veya yanlış olabilirler, herhangi bir şeye göre hareket etmeden veya göndermeden önce gözden geçirmekten sen sorumlusun.",
      },
      {
        heading: "2. Hesabın",
        body: "Giriş bilgilerini güvende tutmaktan ve hesabın altındaki tüm aktiviteden sen sorumlusun. Doğru bir e-posta adresi sağlamalısın.",
      },
      {
        heading: "3. Kabul edilebilir kullanım",
        body: "Şunları yapmamayı kabul edersin: Zappivot'u istenmeyen, aldatıcı veya yasa dışı mesajlar göndermek ya da geçerli spam karşıtı yasaları ihlal etmek için kullanmak; günlük kullanım limitlerini veya herhangi bir outreach e-postası gönderilmeden önce gereken insan onayı adımını atlatmaya çalışmak; hizmeti, kişilerin yasal haklarını ihlal edecek şekilde veri toplamak veya işlemek için kullanmak; Zappivot'u veya altyapısını kötüye kullanmak, aksatmak veya yetkisiz erişim denemek.",
      },
      {
        heading: "4. Otomatik gönderim yok",
        body: "Zappivot, senin açık, mesaj bazlı onayın olmadan asla bir outreach e-postası göndermez. Onayladığın ve gönderdiğin herhangi bir e-postanın içeriğinden ve alıcılarından yalnızca sen sorumlusun.",
      },
      {
        heading: "5. Planlar ve limitler",
        body: "Zappivot şu anda günlük kullanım limitleri olan bir Ücretsiz plan sunuyor. Ücretli planlar henüz mevcut değil; sitede gösterilen fiyatlandırma geçicidir ve lansmandan önce değişebilir.",
      },
      {
        heading: "6. Sorumluluk reddi ve sınırlaması",
        body: 'Zappivot "olduğu gibi" sunulur, hiçbir garanti verilmez. Yasaların izin verdiği azami ölçüde, hizmeti kullanımından kaynaklanan dolaylı, arızi veya sonuç niteliğindeki zararlardan (gönderdiğin outreach\'in sonuçları dahil) sorumlu değiliz.',
      },
      {
        heading: "7. Fesih",
        body: "Zappivot kullanımını istediğin zaman durdurabilir ve hesap silinmesi talep edebilirsin. Bu şartları ihlal eden hesapları askıya alabilir veya feshedebiliriz.",
      },
      {
        heading: "8. Değişiklikler",
        body: "Ürün geliştikçe bu şartları güncelleyebiliriz. Bir değişiklikten sonra Zappivot'u kullanmaya devam etmen, güncellenmiş şartları kabul ettiğin anlamına gelir.",
      },
    ],
    contact: "Bu şartlar hakkında sorun mu var? E-posta:",
  },
  de: {
    intro:
      "Diese Bedingungen regeln deine Nutzung von Zappivot unter zappivot.com. Mit der Erstellung eines Kontos stimmst du ihnen zu.",
    sections: [
      {
        heading: "1. Der Dienst",
        body: "Zappivot hilft Agenturen, Prospect-Unternehmen zu entdecken, Entscheidungsträger zu recherchieren und personalisierte Outreach-Entwürfe mit AI zu erstellen. AI-Ausgaben (Unternehmensrecherche, Scores, E-Mail-Entwürfe) werden aus öffentlich verfügbaren Quellen und deinen Kriterien generiert — sie können unvollständig oder ungenau sein, und du bist dafür verantwortlich, alles zu prüfen, bevor du danach handelst oder es versendest.",
      },
      {
        heading: "2. Dein Konto",
        body: "Du bist dafür verantwortlich, deine Anmeldedaten sicher zu halten und für alle Aktivitäten unter deinem Konto. Du musst eine korrekte E-Mail-Adresse angeben.",
      },
      {
        heading: "3. Zulässige Nutzung",
        body: "Du stimmst zu, Zappivot nicht zu nutzen, um unerwünschte, irreführende oder rechtswidrige Nachrichten zu senden oder geltende Anti-Spam-Gesetze zu verletzen; nicht zu versuchen, die täglichen Nutzungslimits oder den erforderlichen manuellen Freigabeschritt vor jedem Outreach-Versand zu umgehen; den Dienst nicht zu nutzen, um Daten über Personen auf eine Weise zu sammeln oder zu verarbeiten, die deren gesetzliche Rechte verletzt; Zappivot oder die zugrunde liegende Infrastruktur nicht zu missbrauchen, zu stören oder unbefugt darauf zuzugreifen.",
      },
      {
        heading: "4. Kein automatischer Versand",
        body: "Zappivot sendet niemals eine Outreach-E-Mail ohne deine ausdrückliche, nachrichtenbezogene Genehmigung. Du bist allein verantwortlich für Inhalt und Empfänger jeder E-Mail, die du genehmigst und versendest.",
      },
      {
        heading: "5. Pläne und Limits",
        body: "Zappivot bietet derzeit einen kostenlosen Plan mit täglichen Nutzungslimits an. Kostenpflichtige Pläne sind noch nicht verfügbar; die auf der Website angezeigten Preise sind vorläufig und können sich vor dem Launch ändern.",
      },
      {
        heading: "6. Haftungsausschluss und Haftungsbeschränkung",
        body: 'Zappivot wird "wie besehen" bereitgestellt, ohne jegliche Gewährleistung. Im gesetzlich zulässigen Umfang haften wir nicht für indirekte, beiläufige oder Folgeschäden, die aus deiner Nutzung des Dienstes entstehen, einschließlich der Ergebnisse von dir gesendeter Outreach.',
      },
      {
        heading: "7. Kündigung",
        body: "Du kannst die Nutzung von Zappivot jederzeit einstellen und die Löschung deines Kontos beantragen. Wir können Konten, die gegen diese Bedingungen verstoßen, sperren oder kündigen.",
      },
      {
        heading: "8. Änderungen",
        body: "Wir können diese Bedingungen im Zuge der Produktentwicklung aktualisieren. Die fortgesetzte Nutzung von Zappivot nach einer Änderung bedeutet, dass du die aktualisierten Bedingungen akzeptierst.",
      },
    ],
    contact: "Fragen zu diesen Bedingungen? E-Mail:",
  },
};

export const legalContactEmail = emailLine;
