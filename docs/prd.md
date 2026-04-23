# Kairon — Product Requirements Document

**The moment your agent's work becomes attestation.**

*Version 0.3 — Skill-First Reframe for Monad Blitz*

---

## 1. Ozet

Kairon, AI coding agent'larinin yaptigi is icin **bagimsiz, dogrulanabilir, tasinabilir** bir tamamlanma kaniti katmanidir. Agent bir gorev ustlendiginde, Kairon o gorev icin **success criteria** tutar ve is "tamam" diye isaretlenmeden once criteria'nin gercekten gectigini otomatik dogrular. Sonuc kaydedilir, imzalanir ve ticket'in kapanma karari iddia uzerine degil kanit uzerine verilir.

Kairon, agent'in icinden calisan bir **skill**'dir — ayri bir tool degil, agent'in yeni bir yetenegi. Dev Claude Code'da "bunu sealed ticket olarak yap" der, Kairon arka planda ticket acar, criteria onerir, isi yaptirr, dogrular ve muhurler. Dev yeni bir tool ogrenmez, mevcut workflow'una bir mod ekler.

Teknik olarak: primary surface agent skill'idir (bugun Claude Code), backing implementation bir CLI'dir (TypeScript). Gelecekte Cursor extension, Codex plugin gibi her agent'in native ekosisteminde yasayan arayuzler eklenecek — CLI ortak katman olarak hepsinin altinda calisir. Git-native, opsiyonel olarak onchain-attestable.

---

## 2. Problem Tanimi

### 2.1 Gozlenen davranis

2026 itibariyle dev'ler artik tek bir AI araci kullanmiyor. Bir dev'in tipik gunu soyle gorunuyor:

- Sabah Claude Code'da bir auth refactor baslatiliyor
- Oglen Cursor'da UI duzenlemeleri yapiliyor
- Ogleden sonra Codex CLI'da testler yazdiriliyor
- Ertesi gun Gemini'ye performance check yaptiriliyor

Butun bu agent'lar **"gorev tamamlandi"** cevabini donuyor. Ama bu cevap:

- Kendi icinden gelen bir iddia (self-reported)
- Dogrulamasi kullaniciya kalmis (manual verify)
- Kaydi ephemeral (chat history silinince kayip)
- Tool'a bagli (vendor-locked, portable degil)

### 2.2 Bu davranisin yarattigi gercek hasarlar

**Hasar 1 — Sessiz basarisizlik.** Agent "yaptim" dedi, dev "tamam bakarim" dedi, bakmadi. Kod merge oldu. Bir hafta sonra production'da bug cikti. Kimse o ticket'in gercekten test edilmedigini bilmiyordu.

**Hasar 2 — Review guvenini curutuyor.** Code review'cu PR'a baktiginda "testler gecmis" ibaresini goruyor. Ama testler **kim tarafindan** ne zaman kosturuldu? Agent "evet kostu" dediyse o yeter mi? Reviewer'lar eskisinden daha fazla suphe duyuyor, review yavaslyor.

**Hasar 3 — Freelance ve kontrat isi cokuyor.** Bir freelancer musteriye "bu isi Claude ile yaptim, testler geciyor" diyor. Musteri emin olamiyor. Pazarda guven dibe vurumus durumda. Fiyatlar dusuyor cunku kimse kimsenin iddiasina inanmiyor.

**Hasar 4 — AI tool ROI'si olculemiyor.** Takim ayda $5-10K AI harciyor ama yaptirilan isin gercekten tamamlanip tamamlanmadigi hakkinda kanitli bir rapor yok. Manager "bu yatirim degiyor mu?" sorusuna cevap veremiyor.

**Hasar 5 — Multi-agent koordinasyon imkansiz.** Iki agent paralel calisiyor, biri "auth bitti" dedi, digeri onun ustune build etmeye basladi. Ama auth gercekten bitmemisti, agent oyle sandi. Zincirleme hata.

### 2.3 Neden mevcut cozumler yetersiz

**CI/CD pipeline'lari** testleri kosturuyor ama ticket seviyesinde baglam yok. CI "testler gecti" der, hangi agent hangi is icin kosturdu baglantisi kurulamiyor. CI output'u artifact olarak saklanabiliyor, ancak ticket niyeti (ne istendi), criteria (ne beklendi) ve outcome (ne oldu) uclusu tek bir yerde birlesmiyor.

**Claude Managed Agents (Nisan 2026)** outcome feature'i baslatti. Ama:
- Sadece Claude icin calisiyor (vendor-locked)
- Degerlendirmeyi Claude'un kendisi yapiyor (self-evaluation, external verification degil)
- Kayitlar Anthropic Console'da duruyor (portable degil)
- Research preview (erisim kisitli)

**GitHub issue/PR akislari** linear. "Bu PR su issue'yu kapatti" der ama "su criteria gercekten karsilandi" demez. Issue aciklamasi insan tarafindan yazilir, outcome insan tarafindan onaylanir.

**Dex ve benzeri agent task trackerlar** ticket yapisi kuruyor ama outcome verification yok. "Result: yaptim" yazilip geciliyor.

Yani **dogrulanmis, tasinabilir, agent-agnostic bir ticket context layer** bos alanda. Kairon bu boslugu dolduruyor.

---

## 3. Urun Vizyonu

### 3.1 Tek cumle

Kairon, AI coding agent'ina yukleyebildigin bir skill'dir — "bunu sealed yap" dersin, agent isi yapar, dogrular, muhurler. Ayri bir tool ogrenmene gerek yok.

### 3.2 Pitch

**Eski pitch (v0.2):** "Agent ticket'larina verifiable outcome ekliyoruz, CLI ustunden calisiyor, Claude/Cursor/Codex hepsiyle."

**Yeni pitch (v0.3):** "Claude Code'a bir skill yukluyorsun. O andan itibaren her task'i 'sealed' modda yapabiliyorsun — niyet yazarsin, Kairon kriterleri onerir, onaylarsin, is yapilir, dogrulanir, kanitla kapanir. Ayri bir tool ogrenmene gerekmiyor. Claude Code'un yeni bir modu gibi."

### 3.3 Kullanici icin vaat

**Dev'e:** "Agent'ina 'sealed yap' de, gerisini o hallediyor. 'Gercekten oldu mu' sorusunu bir daha sormuyorsun."

**Takima:** "Kim hangi isi hangi kanitla kapatti, gozunuzun onunde."

**Freelancer'a:** "Musterine yaptigin isin dogrulanmis HTML raporunu gonderebilirsin. Tartisma bitiyor."

**Manager'a:** "AI tool harcanizin gercekten ne urettigi, kanitli sekilde gorunur oluyor."

### 3.4 Pozisyonlama: Skill-First

Kairon yeni bir tool degil, agent'in yeni bir **yetenegi**. Bu framing kritik:

| | CLI-first (v0.2) | Skill-first (v0.3) |
|---|---|---|
| Kurulum | `npm install -g kairon` + `kairon init` | Skill yukle (tek komut) |
| Kullanim | 7 adim, her biri kayip orani | "bunu sealed yap" de, 1 adim |
| Cognitive load | "yeni tool ogrenmeliyim" | "Claude Code'un yeni bir modu" |
| Dev gorunurlugu | CLI komutlari elle kosturulur | Agent arka planda halleder |
| Benzetme | Zapier'i "yeni tool" olarak sunmak | Zapier'i "integration" olarak sunmak |

Dev'in gordugu akis:

```
   [Developer + Claude Code]
       |
       | "bu auth refactor'u sealed ticket olarak yap"
       v
   +--------------------------------------------+
   | Kairon Skill (Claude Code icinde)          |
   |                                            |
   |  1. Ticket acar                            |
   |  2. Kodu okur, criteria onerir             |
   |  3. Dev onaylar (y/n/edit)                 |
   |  4. Agent isi yapar                        |
   |  5. Criteria otomatik kosturulur           |
   |  6. Gecerse: seal + git commit             |
   |  7. Onchain attestation (opsiyonel)        |
   |  8. HTML rapor uretilir (opsiyonel)        |
   +--------------------------------------------+
```

Dev sadece 3. adimda muhatap — gerisi otomatik. CLI arka planda calisiyor ama dev onu gormuyor.

**Mimari katmanlar:**

```
   Primary surface:     Claude Code skill    (dev bunu goruyor)
                              |
                              | calls
                              v
   Backing layer:        Kairon CLI          (skill bunu kullaniyor)
                              |
                              | writes
                              v
   Storage:              kairon/tickets/     (git-native markdown)
                              |
                              | attests (opt.)
                              v
   Onchain:              Monad contract      (tamper-evident record)

   Future surfaces:      Cursor extension, Codex plugin, Gemini adapter
                         (hepsi ayni CLI'i kullaniyor, farkli arayuz)
```

---

## 4. Cekirdek Kavramlar

### 4.1 Ticket

Bir Kairon ticket'i dort parcadan olusur:

- **Description** — Bir cumlelik ozet: "JWT'den session cookie'ye gecis"
- **Context** — Gerekce, arka plan, kisitlar
- **Success Criteria** — Otomatik dogrulanabilir sartlar listesi
- **Outcome** — Criteria calistirildiktan sonra cikan kanit

Ticket bir markdown dosyasidir (`kairon/tickets/{id}.md`), repo ile beraber yasar, git ile commit edilir.

### 4.2 Success Criteria

**Seviye 1 — Structured shortcuts.** Hazir sablonlar:

```yaml
criteria:
  - test: auth.test.ts
  - benchmark: p95 < 50ms on /login
  - build: passes
  - coverage: > 80% on changed files
```

**Seviye 2 — Shell komut.** Her turlu komutu exit code / output pattern'iyla dogrular:

```yaml
criteria:
  - shell: npm test
    expect_exit: 0
  - shell: curl -f localhost:3000/health
    expect_exit: 0
```

**Seviye 3 — Human attestation.** Otomatik dogrulanamayan kriterler icin acikca "insan dogruladi" kaydi:

```yaml
criteria:
  - human: "mobile responsive gorunum tamam"
    attested_by: ahmet@team
```

Durustluk buradan gelir: otomatik olani otomatik dogrular, olmayani acikca "insan dedi" diye isaretler. Gizli insan isi ile otomatik is karismaz.

> **Not:** v0.2 MVP'de yalnizca Seviye 2 (shell criteria) desteklenmektedir. Seviye 1 (structured shortcuts) ve Seviye 3 (human attestation) roadmap'tedir.

### 4.3 Criteria Suggestion Flow

Criteria yazma surtusmesini azaltmak icin Kairon skill'i, agent'in kendi icinde calisan bir **oneri akisi** sunar. Dev ayri bir komut kosmaz — agent conversation icinde sorar:

```
Dev: "JWT'den session cookie'ye gecisi sealed ticket olarak yap"

Claude Code (Kairon skill):
  Ticket #042 aciyorum: "JWT -> session cookie gecisi"

  Codebase'i okudum, su criteria'lari oneriyorum:
    1. npm test -- auth.test.ts        (exit 0 beklenir)
    2. npm test -- session.test.ts     (exit 0 beklenir)
    3. npm run build                   (exit 0 beklenir)

  Kabul ediyor musun? [Y/n/edit]

Dev: y

Claude Code (Kairon skill):
  Criteria onaylandi. Ise basliyorum...
  [... normal agent calismasi ...]
  Is tamamlandi. Criteria kosturuyorum...
  - pass: auth.test.ts (47 passed)
  - pass: session.test.ts (23 passed)
  - pass: build (exit 0, 4.2s)
  Hepsi gecti. Ticket #042 sealed, commit atildi.
```

Dev'in yaptigi tek sey: "sealed yap" demek ve criteria'yi onaylamak. Agent kodu okuyarak ilgili test dosyalarini, build komutlarini ve mevcut CI script'lerini tespit eder ve criteria onerir. "Criteria yazmak cok is" engeli dusmus oluyor cunku dev zaten Claude Code ile konusuyor — ekstra bir arayuz yok.

### 4.4 Verification — iki mod (v0.2)

**Open** — Criteria yok, tipki normal task gibi. Agent calisir, sonuc yazilir, ticket kapanir. Attestation yok. Default, en hafif kullanim.

**Sealed** — Criteria var, lokal olarak otomatik dogrulanir. Kriter gecmezse ticket "sealed" olamaz, acik kalir. Cogu is icin yeterli.

> **Roadmap:** Critical mod (bagimsiz dogrulayicilar devrede) yuksel onem tasiyan ticket'lar icin planlanmaktadir. Ornegin uretim release'leri, guvenlik ticket'lari.

### 4.5 Seal

Ticket verification basarili oldugunda "sealed" durumuna gecer. Sealed ticket'in uzerine dusen degerler:

- Outcome kaydi (test sayisi, benchmark degeri, vs)
- Timestamp
- Iliskili commit SHA
- Iliskili dev/agent imzasi
- Tamper-evident hash (outcome'in cryptographic ozeti)
- *Opsiyonel:* Monad'da attestation tx hash

Sealed ticket git'e commit'lenir. Sonradan degistirilmek istenirse git history'de gorunur, immutability saglanmis olur. Onchain attestation aciksa ek bir guven katmani eklenir.

> **Terminoloji notu:** Kairon "proof" (kanit) degil "attestation" (taniklik) kavramini kullanir. Onchain'e yazilan hash, kriptografik bir ispat degil, belirli bir anda belirli bir outcome'un var olduguna dair tamper-evident bir kayittir.

### 4.6 Replay

Her Kairon ticket'i **replay edilebilir** olmalidir. Yani alti ay sonra "bu ticket gercekten dogru mu kapatilmisti" diye bakan biri, criteria'yi tekrar kosturup ayni sonucu alabilmelidir. Bu deterministik bir "audit" yolu saglar.

### 4.7 HTML Report

Sealed bir ticket icin paylastrilabilir bir HTML raporu uretilir:

```
$ kairon report 042 --html

Generated: kairon/reports/042.html
```

Rapor icerigi:
- Ticket ozeti (title, context, agent, timestamp)
- Criteria listesi ve her birinin sonucu (pass/fail)
- Outcome detaylari (test sayilari, benchmark degerleri)
- Seal hash ve onchain attestation linki (varsa)
- Replay talimatlari

Bu rapor freelancer'in musteriye, dev'in manager'a, maintainer'in contributor'a gonderebilecegi bagimsiz bir belge olarak calisir. Terminal gerektirmez, tarayicida acilir.

---

## 5. Kullanici Senaryolari

### 5.1 Solo dev, freelance is

Ayse bir musteri icin Claude Code ile auth sistemi yaziyor. Is bitince fatura kesecek.

**Kairon'suz:** Ayse "bitti, test ettim" diyor. Musteri "nasil emin olayim?" diyor. Uzun tartisma, guven kiriliyor.

**Kairon ile:** Ayse Claude Code'a "auth gecisini sealed ticket olarak yap" diyor. Kairon skill'i criteria oneriyor, Ayse onayliyor, Claude isi yapiyor, criteria otomatik kosuyor, ticket sealed oluyor. Ayse "rapor uret" diyor, HTML raporu musteri'ye gonderiyor. Musteri tarayicida aciyor: hangi testler gecti, ne zaman, hangi commit — hepsi gorunuyor. Tartisma yok.

### 5.2 Takim, multi-agent is

6 kisilik takim paralel calisiyor. Ahmet Claude Code'da, Zeynep Cursor'da, Mert Codex'te.

**Kairon'suz:** Her gun standup'ta "ne yaptiniz" soruluyor. Herkes farkli sekilde rapor veriyor. Kim ne bitirmis, net degil.

**Kairon ile:** Her agent Kairon skill/extension'i ustunden calisiyor. `kairon list` ile (veya agent'a sorarak) hangi ticket hangi durumda (open/sealed) anlik gorunuyor. "Auth sealed" ise Zeynep onun ustune guvenle UI yazmaya baslayabiliyor.

### 5.3 Manager, AI yatirim karari

IT muduru sirketin Claude + Cursor + Copilot aboneliklerinin degerli olup olmadigini olcmek istiyor.

**Kairon'suz:** AI harcama raporu var ($8K/ay), ama karsiliginda ne uretildigi belirsiz.

**Kairon ile:** Gecen ay 340 ticket acildi, 287'si sealed oldu, 53'u open kaldi (tamamlanamadi). Sealed ticket'lar icinde toplam kac test gecti, kac kritik feature merge oldu, net. "AI $8K yakti, $x karsiligi kanitli is cikti" cevabi verilebilir oluyor.

### 5.4 Open source maintainer

Bir OSS maintainer, contributor'lardan gelen PR'larda AI kullanimina karsi degil, ama "test edilmeden 'bitti' denmesini" istemiyor.

**Kairon'suz:** PR aciklamasi "Claude ile yazdim, testler geciyor" diyor. Maintainer manuel kosturmak zorunda.

**Kairon ile:** Repo'nun CI'i Kairon entegrasyonu yapiyor. Contributor sealed ticket acmadan PR mergelenemiyor. Maintainer PR'a baktiginda "bu sealed, criteria deterministik gecmis" goruyor. Review is yuku dusuyor.

---

## 6. Teknik Yapi

### 6.1 Mimari: Skill + CLI

Kairon iki katmandan olusur:

**Katman 1 — Agent Skill (primary surface).** Dev'in gordugu ve etkilestigi arayuz. Bugun Claude Code skill'i, yarin Cursor extension, Codex plugin. Skill, agent'in conversation akisi icinde calisir — dev ayri bir terminal acmaz, ayri komutlar ogrenmez. Skill arka planda CLI'i cagirir.

**Katman 2 — CLI (backing implementation).** Skill'in cagirdigi TypeScript CLI. Ticket CRUD, criteria runner, seal logic, attestation, report generation burada yasar. Power user'lar dogrudan CLI kullanabilir, ama default kullanim skill uzerinden.

### 6.2 Bilesenler

**Ticket store.** `kairon/tickets/` dizininde markdown dosyalari. Her ticket bir dosya, frontmatter'da metadata, govdede aciklama.

**Claude Code skill (primary surface).** `SKILL.md` + komut tanimlar. Agent conversation icinde Kairon'u aktive eder: ticket acar, criteria onerir, verify/seal yapar. Dev'in gordugu tek arayuz budur.

**CLI (backing layer).** `kairon` komutu. Skill'in arka planda cagirdigi komutlar:
- `kairon open "title"` — yeni ticket acar
- `kairon verify <id>` — criteria'yi kosturur
- `kairon seal <id>` — verify + sealed commit + opt. onchain attestation
- `kairon list` — acik/kapali ticket'lari gosterir
- `kairon show <id>` — ticket detayini gosterir
- `kairon replay <id>` — gecmis bir ticket'in verification'ini tekrarlar
- `kairon report <id> --html` — paylastrilabilir HTML raporu uretir

**Verifier engine.** Criteria formatina gore:
- Shell: komut kosturur, exit code ve output pattern yakalar
- *Roadmap:* Structured (jest/pytest/go test runner'lari)
- *Roadmap:* Human (signed attestation)

**Report generator.** Sealed ticket'tan bagimsiz, paylastrilabilir HTML raporu uretir. Terminal gerektirmeden sonuclarin incelenmesini saglar.

**Attestation layer (opsiyonel).** Sealed ticket'in hash'i Monad smart contract'ina yazilir. Basit bir event emit, tamper-evident kayit.

### 6.3 Bir ticket'in hayat dongusu (skill-first)

**Dev'in gordugu (skill arayuzu):**

```
Dev: "auth refactor'u sealed ticket olarak yap"
  |
  v
Skill criteria onerir, dev onaylar
  |
  v
Agent isi yapar (normal Claude Code calismasi)
  |
  v
Skill: "Is bitti, criteria kosturuyorum..."
  |
  v
Skill: "Hepsi gecti, sealed. Rapor istersen 'rapor uret' de."
```

**Arka planda olan (CLI katmani):**

```
skill calls: kairon open "auth refactor" --criteria-from-suggestion
  |
  v
kairon/tickets/042.md yaratilir, status: open
  |
  v
[agent calisiyor, kodlar yaziliyor]
  |
  v
skill calls: kairon verify 042
  |
  v
Verifier engine criteria'yi kosturur
  |
  v
skill calls: kairon seal 042
  |
  v
Ticket'a outcome eklenir, hash hesaplanir, git commit atilir
  |
  v
Eger onchain opsiyonu aciksa: hash Monad'a attest edilir
  |
  v
Status: sealed
```

### 6.4 Dosya formati ornegi

```markdown
---
id: 042
title: JWT -> session cookie gecisi
status: sealed
created: 2026-04-22T10:34:12Z
sealed: 2026-04-22T14:21:44Z
agent: claude-opus-4.6
commit: a7f3b2d
attestation_hash: 0x4a7f8e2c...
onchain: monad://tx/0xb2c8...
---

## Context
Client'larda session timeout sikayetleri artiyor. JWT'nin stateless
yapisi session invalidation sorunu yaratiyor. Server-side session'a
gececegiz, Redis store kullanacagiz.

## Criteria
- shell: npm test -- auth.test.ts
  expect_exit: 0
- shell: npm test -- session.test.ts
  expect_exit: 0
- shell: npm run build
  expect_exit: 0

## Outcome
- pass: npm test -- auth.test.ts (47 passed, 0 failed, exit 0)
- pass: npm test -- session.test.ts (23 passed, 0 failed, exit 0)
- pass: npm run build (exit 0, 4.2s)

Attestation: 0x4a7f8e2c9d1b...
Onchain: monad://tx/0xb2c8...
```

### 6.5 Tech Stack

| Katman | Teknoloji | Neden |
|---|---|---|
| Primary surface | Claude Code skill (SKILL.md) | Dev'in gordugu arayuz, sifir kurulum |
| Backing CLI | TypeScript + Node.js | npm dagilimi kolay, skill arka planda cagirir |
| Storage | Markdown dosyalar (frontmatter + body) | Git-native, insan-okunabilir, diff-friendly |
| Criteria runner | Child process (shell exec) | Agent-agnostic, her dilde test kosturur |
| Attestation hash | SHA-256 | Standart, hizli, tamper-evident |
| Onchain | Monad (Solidity, basit event emit) | Hackathon target chain, dusuk gas |
| Report | Standalone HTML (inline CSS) | Bagimsiz paylasim, sunucu gerektirmez |
| Future surfaces | Cursor ext., Codex plugin | Ayni CLI, farkli native arayuzler |

---

## 7. Farklilasma

| Sistem | Criteria tanimi | Dogrulama | Tasinabilirlik | Agent destegi |
|---|---|---|---|---|
| Manuel review | Yok | Insan | — | Herhangi |
| CI/CD | Pipeline script | Otomatik ama ticket-ayrik | Repo'ya bagimli | — |
| GitHub Actions | Workflow file | Otomatik | GitHub'a bagimli | — |
| Claude Managed Agents | Prompt + criteria | Agent self-eval | Anthropic'e bagimli | Claude-only |
| Dex | Yok | Yok | Git-native | Claude Code |
| **Kairon** | **Shell + agent suggestion** | **Bagimsiz verifier** | **Git-native + opt. onchain** | **Skill-native** |

Kairon'un farki iki eksende:

**1. Ticket context layer.** Agent niyeti (ne istendi), criteria (ne beklendi) ve outcome (ne oldu) uclusunu tek bir yerde, dogrulanabilir sekilde tutuyor. CI/CD pipeline'lari testleri kosturur ama bu ucluyu birlestirmez. Dex ticket tutar ama dogrulamaz. Claude Managed Agents dogrular ama vendor-locked ve self-eval.

**2. Skill-native dagitim.** Diger toollar "CLI yukle, komut ogren, workflow'una ekle" der. Kairon "skill yukle, 'sealed yap' de" der. Adoption bariyeri fundamentally farkli — yeni bir tool degil, mevcut agent'in yeni bir yetenegi.

---

## 8. Basari Metrikleri

### 8.1 Hackathon (kisa vade)

- **Calisir demo:** Canli ticket acilir, agent calisir, criteria kosar, seal olur, Monad'a attest edilir, HTML rapor uretilir — bu akis uctan uca gosterilir
- **Replay basarisi:** Sealed ticket'in verify'i tekrar kosturuldugunde ayni sonucu verir
- **Juri "aha" ani:** 3 dakikada problem -> cozum -> demo akisi anlatilir

### 8.2 Orta vade (ilk 3 ay)

- Sealed/Open ticket orani — kullanicilarin ne kadar isi "kanitli" bitirdigi
- Adoption: kac dev skill'i yukleyip 1 gercek ticket kapatiyor
- Review suresi: Sealed PR'larin review suresi, sealed olmayanlara gore

### 8.3 Uzun vade

- Production bug orani: Kairon ile kapatilan ticket'lardan prod'a giden hata orani
- AI tool ROI raporu: takimlarin AI harcamalarini kanitli is ciktisina donusturebilmesi
- Agent skill/extension sayisi: kac farkli agent Kairon ile native calisabiliyor

---

## 9. Kapsam

### 9.1 v0.3 MVP (Hackathon)

| Katman | Ozellik | Durum |
|---|---|---|
| **Skill** | Claude Code skill (SKILL.md + komutlar) | MVP |
| **Skill** | Criteria suggestion flow (agent onerir, dev onaylar) | MVP |
| **Skill** | Uctan uca akis: "sealed yap" -> ticket -> verify -> seal | MVP |
| **CLI** | `kairon open` / `list` / `show` | MVP |
| **CLI** | `kairon verify` (shell criteria) | MVP |
| **CLI** | `kairon seal` (git commit + attestation hash) | MVP |
| **CLI** | `kairon report --html` | MVP |
| **CLI** | `kairon replay` | MVP |
| **Onchain** | Seal hash -> Monad attestation (event emit) | MVP |

### 9.2 Roadmap (v0.3 sonrasi)

| Ozellik | Oncelik |
|---|---|
| Structured criteria shortcuts (test/benchmark/coverage) | Yuksek |
| Human attestation modu | Yuksek |
| Cursor extension (ayni CLI, native Cursor arayuzu) | Orta |
| Codex plugin | Orta |
| Critical verification modu (bagimsiz verifier) | Orta |
| CI/CD entegrasyonu (GitHub Actions, GitLab CI) | Orta |
| Web dashboard | Dusuk |
| Multi-agent koordinasyon protokolu | Dusuk |

### 9.3 Kapsam disi (bilerek)

Kairon **sunlari yapmiyor**:

- **Agent secmiyor.** Hangi agent'i kullanacagina dev karar verir.
- **Kodun kalitesini degerlendirmiyor.** "Bu kod guzel mi" demiyor, "istedigin kosul gerceklesti mi" diyor.
- **Security audit degil.** Criteria'lari kosturur, guvenclik araci degildir.
- **CI/CD yerine gecmiyor.** CI/CD ile beraber calisiyor, ustune ticket context layer ekliyor.
- **Universal agent framework degil.** Agent'i wrap ediyor, yerine gecmiyor.
- **Zorunlu onchain degil.** Monad integration opsiyonel guclendrirci. Core product offline ve local calisiyor.

---

## 10. Riskler ve Karsi Argumanlar

### 10.1 "Claude Managed Agents zaten bunu yapiyor"

Claude Managed Agents outcome degerlendirmesini **agent'in kendisine** yaptiriyor — self-evaluation. Kairon bagimsiz, disaridan calisan verifier'a sahip. Ayrica Claude-only, Kairon agent-agnostic. Ve Kairon portable, Anthropic'e bagimli degil.

### 10.2 "Dev criteria yazmaktan usenir, kullanmaz"

Iki katmanli cevap:

**Skill-first framing ile "yazmak" zaten yok.** Dev CLI'da criteria elle yazmak zorunda degil — agent conversation icinde "sealed yap" der, skill kodu okur, criteria onerir, dev "y" der. Yeni bir arayuz, yeni bir syntax ogrenmek yok.

**Criteria suggestion flow ile friction minimal.** Agent ilgili test dosyalarini ve build komutlarini tespit eder, criteria onerir. Dev sadece Y/N/edit yapar. Ayrica Open mod her zaman mevcut — criteria yazmak zorunlu degil.

### 10.3 "CI/CD zaten kosuyor, niye ekstra katman?"

CI/CD testi kosturuyor ama ticket seviyesinde niyet + beklenti + sonuc uclusunu birlikte tutmuyor. Kairon bir **ticket context layer** olarak bu ucluyu tek yerde, sorgulanabilir ve replayable sekilde tutuyor. CI ile cakismiyor, tamamliyor.

### 10.4 "Criteria fake'lenebilir, dev bypass eder"

Lokal modda evet, teorik olarak. Bu yuzden Critical mod planlanmis (bagimsiz verifier, roadmap). Ayrica criteria ve outcome birlikte commit'lenir — sonradan criteria'yi degistirmek git history'de izli olur. Onchain attestation aciksa hash degisikligi Monad'da gorunur. "Kimse denetlemiyorsa bypass mumkun" her sistem icin gecerli; Kairon *denetleyebilir* hale getiriyor.

### 10.5 "Agent'lar hizla degisiyor, 6 ay sonra gerek kalmayabilir"

Tersine: agent'lar ne kadar otonom olursa, hesap verebilirlik katmanina o kadar cok ihtiyac var. Bugun "agent yaptim dedi, ben bakacagim" yetiyor cunku insan kontrolu elinde. Agent'lar paralel calisip kendi kararlarini verir hale geldikce dogrulama katmani *daha* kritik oluyor.

Skill-first mimari bu riski de absorbe ediyor: CLI ortak katman olarak sabit, arayuz her agent'in native ekosistemine uyum sagliyor. Yeni bir agent yukselirse, yeni bir skill/extension yazilir, core degismez.

### 10.6 "Onchain attestation gercekten gerekli mi?"

Zorunlu degil, bu yuzden opsiyonel. Ama belirli senaryolarda (freelance is kaniti, compliance gereksinimleri, cross-org guven) tamper-evident ve ucuncu partilerce dogrulanabilir bir kayit gercek deger yaratiyor. Git history'si local olarak degistirilebilir; onchain attestation degistirilemez.

---

## 11. Sonuc

Kairon, AI coding'in su anki buyume noktasinda bos duran bir katmani dolduruyor: **iddia ile attestation arasindaki bosluk**. Agent'lar artik is yapiyor; ama "yaptim" iddiasinin disaridan dogrulanabilir, tasinabilir, zaman icinde tekrarlanabilir kaydi yok. Kairon bu kaydi olusturuyor.

Bunu yaparken dev'e yeni bir tool ogrenmesini dayatmiyor. Claude Code'a bir skill yukluyorsun, "sealed yap" diyorsun, gerisini agent hallediyor. Yeni bir tool degil, mevcut agent'in yeni bir yetenegi.

Ticket seviyesinde tek bir soruyu cevapliyor:

> *"Agent gercekten yapti mi, yoksa oyle mi sandi?"*

Kairon'un adi Yunanca **kairos**'tan geliyor — yakalanmasi gereken an. Bir isin gercekten tamamlandigi o an. Biz o ani yakalayip muhurluyoruz.

---

*End of PRD v0.3 — Skill-First Reframe for Monad Blitz*
