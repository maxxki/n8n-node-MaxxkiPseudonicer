# n8n-nodes-maxxki-pseudonicer

Eine n8n Community Node zur Pseudonymisierung von personenbezogenen Daten (PII) – komplett offline.

## Funktionen

- ✅ **Emails** erkennen und redacten
- ✅ **Telefonnummern** (deutsch +49, 0, 0049)
- ✅ **IBANs** mit Prüfziffer-Validierung
- ✅ **Kreditkarten** mit Luhn-Prüfung
- ✅ **Namen** (Herr/Frau/Dr., Kontext aus JSON-Keys)
- ✅ **Firmennamen** (GmbH, AG, Ltd, ...)
- ✅ **IP-Adressen, Steuernummern, Kennzeichen**
- ✅ **Obfuskierte PII** (z.B. "m a x @ t e s t . d e")
- ✅ **JSON-Rekursion** mit Kontext-Hinweisen

## Installation

```bash
cd ~/.n8n/custom
git clone https://github.com/deinname/n8n-nodes-maxxki-pseudonicer
cd n8n-nodes-maxxki-pseudonicer
npm install
npm run build
