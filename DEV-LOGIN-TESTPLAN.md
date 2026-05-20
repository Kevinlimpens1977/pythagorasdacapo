# Developer Login Testplan

Deze tijdelijke login is alleen bedoeld voor lokale browser- en Playwright-tests.

## Activeren

Zet lokaal in `.env.local`:

```env
VITE_ENABLE_DEV_LOGIN=true
```

Start daarna de devserver opnieuw.

## Handmatige test

1. Open de loginpagina.
2. Controleer dat de knop `Developer login` zichtbaar is.
3. Klik `Developer login`.
4. Controleer dat de studentroute opent zonder Firebase Anonymous Auth.
5. Refresh de pagina.
6. Controleer dat de lokale sessie blijft bestaan.
7. Klik uitloggen.
8. Controleer dat de lokale dev user is gewist en de loginpagina terugkomt.

## Productieveiligheid

- In productie is `import.meta.env.DEV` false en wordt de dev user genegeerd.
- Zonder `VITE_ENABLE_DEV_LOGIN=true` is de knop niet zichtbaar.
- De developer login gebruikt geen `signInAnonymously`.
- De developer login schrijft niets naar Firebase Auth en maakt geen Firebase-sessie.
