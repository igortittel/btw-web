# Nastavenie emailu pre kontaktný formulár

## Krok 1: Vytvorte Resend účet
1. Choďte na [resend.com](https://resend.com)
2. Zaregistrujte sa (je to zadarmo)
3. Overte svoj email

## Krok 2: Získajte API kľúč
1. V Resend dashboarde choďte na "API Keys"
2. Kliknite "Create API Key"
3. Pomenujte ho (napr. "BY THE WAVE Contact Form")
4. Skopírujte API kľúč

## Krok 3: Pridajte API kľúč
1. Otvorte súbor `.env.local` v root priečinku
2. Pridajte riadok: `RESEND_API_KEY=váš_api_kľúč_tu`
3. Uložte súbor

## Krok 4: Reštartujte server
\`\`\`bash
npm run dev
\`\`\`

## Čo sa stane:
- ✅ Formulár pošle email na `michalantal@proton.me`
- ✅ Email má pekný HTML dizajn s logom BY THE WAVE
- ✅ Obsahuje všetky údaje z formulára
- ✅ Ak email zlyhá, správa sa loguje do konzoly
- ✅ Používateľ vždy dostane potvrdenie o úspešnom odoslaní

## Testovanie:
1. Vyplňte formulár na stránke
2. Skontrolujte email `michalantal@proton.me`
3. Ak email nepríde, skontrolujte server logy
