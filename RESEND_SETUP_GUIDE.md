# 📧 Návod na nastavenie Resend pre kontaktný formulár

## Krok 1: Vytvorte Resend účet
1. Choďte na **https://resend.com**
2. Kliknite **"Sign up"**
3. Zaregistrujte sa s emailom (je to zadarmo)
4. Overte svoj email

## Krok 2: Získajte API kľúč
1. Po prihlásení choďte na **"API Keys"** v ľavom menu
2. Kliknite **"Create API Key"**
3. Pomenujte ho: `BY THE WAVE Contact Form`
4. Vyberte **"Sending access"**
5. Kliknite **"Add"**
6. **SKOPÍRUJTE API KĽÚČ** (začína sa `re_...`)

## Krok 3: Pridajte API kľúč do projektu
1. Otvorte súbor `.env.local` v root priečinku projektu
2. Pridajte tento riadok:
\`\`\`
RESEND_API_KEY=re_váš_skutočný_api_kľúč_tu
\`\`\`
3. Uložte súbor

## Krok 4: Reštartujte server
\`\`\`bash
npm run dev
\`\`\`

## ✅ Ako poznáte, že to funguje:
- V konzole uvidíte: `✅ Email úspešne odoslaný na michalantal@proton.me`
- Email príde na `michalantal@proton.me`
- Formulár zobrazí správu o úspešnom odoslaní

## 🔧 Ak to nefunguje:
- Skontrolujte, či API kľúč začína `re_`
- Skontrolujte, či nie sú v `.env.local` extra medzery
- Reštartujte server po pridaní API kľúča
- Skontrolujte server logy v konzole

## 📝 Poznámka:
Aj bez API kľúča formulár funguje a loguje správy do konzoly. 
Pre skutočné emaily je potrebný Resend API kľúč.
