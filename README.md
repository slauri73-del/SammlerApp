# CORE SAMMLER · SammelApp

**LOCAL v0.6.3 · Release-Kandidat für lokale Nutzung und manuellen Export.**

Die vollständige HTML-App liegt seit dem 12. Oktober 2026 als `index.html` im Repository (Ausgangspunkt: Commit `662ec9ff912995ee2663aaa0afa68f9ff641a88f`, damals DRIVE v0.6.2). Sie ist kein Platzhalter. Die lokale Version entfernt den Google-OAuth-/Drive-Pfad gemäß der CORE-SAMMLER-Entscheidung. Es gibt keine Anmeldung, keinen direkten Upload und keine automatische Synchronisierung.

## Start und Datenhaltung

1. Repository als ZIP herunterladen und entpacken oder klonen.
2. `index.html` in einem aktuellen Browser öffnen. Für iPhone/iPad ist eine feste HTTPS-Adresse in Safari der sinnvollere Bereitstellungsweg; auf dieser Seite kann „Zum Home-Bildschirm“ angeboten werden.
3. Text oder Links erfassen und regelmäßig **Export JSON** bzw. **Gesamtsicherung exportieren** verwenden. JSON enthält die Metadaten; Text ist ein lesbarer Auszug, keine wiederherstellbare Sicherung.
4. Unter **Lokale Sammlung** lassen sich JSON-Sicherungen importieren und Statuskennzeichen verwalten.

Die App speichert unter dem bisherigen localStorage-Schlüssel `sammelapp_v2`. Daten hängen am Browserprofil und Ursprung (Protokoll, Host, Port). Eine andere Adresse, ein anderer Browser oder gelöschte Browserdaten ergeben eine andere bzw. leere Sammlung. Verhalten unter `file://` ist browserabhängig. Vor einem Wechsel exportieren; es gibt keine automatische Migration zwischen Adressen.

**Datenschutz:** Keine privaten Sammlungen, Sicherungen, Zugangsdaten oder Tokens in dieses öffentliche Repository hochladen. Lokale Speicherung ist weder Verschlüsselung noch eine Datensicherung.

## Tatsächlicher Funktionsumfang

| Bereich | Vorhanden | Grenze |
| --- | --- | --- |
| Erfassen | Text, Notizen, Links; Auswahl erkannter Text-/Linkteile vor dem Speichern | Aufteilung und URL-Normalisierung können den eingegebenen Text verändern; kein unveränderliches Originalarchiv |
| Organisation | Kategorien, Farben, Tags, regelbasierte Zuordnung; Suche und Library-Ansicht mit Filtern/Sortierung | Keine KI-Prüfung oder CORE-LAB-Anbindung |
| Speicherung | Einträge, Kategorien und Regeln in localStorage | Browserquote; keine belastbare Zusage für 50.000+ Einträge; Schreibfehler außerhalb des Imports werden noch nicht nutzerfreundlich behandelt |
| Export | Gesamtes JSON, Text, einzelner Eintrag und Statusauszug als JSON | Ein ausgelöster Download bestätigt nicht, dass die Datei dauerhaft gesichert wurde |
| Quarantäne | Fehlender Status gilt als `01_EINGANG`; Zuordnung nach `02_PRUEFUNG`, `03_FREIGEGEBEN`, `04_ARCHIV`; Statusanzeige an Einträgen | Zuordnung betrifft **alle Eingangseinträge**, unabhängig vom Suchfilter; keine Einzel-/Mehrfachauswahl; „Freigegeben“ ist nur organisatorisch |
| Dubletten | Doppelte URLs werden innerhalb einer Eingabe zusammengefasst; Import überspringt vorhandene und innerhalb der Importdatei wiederholte IDs | Gleicher Inhalt mit unterschiedlichen IDs bleibt erhalten; keine globale Inhaltsprüfung oder Dublettenmarkierung |
| Import | Neues lokales JSON, alte `core-sammler-drive`-Sicherungen (Schema 1) und bisheriger unversionierter JSON-Export | Ergänzt Einträge; ersetzt vorhandene IDs, Kategorien und Regeln **nicht**. Kategorien/Regeln sind im Export enthalten, werden aber noch nicht wiederhergestellt. Max. 20 MB / 100.000 Einträge sind Eingabegrenzen, keine Kapazitätszusage |
| OCR | Vorhandener Tesseract-Pfad für Bilder/Screenshots, Einfügen und Drag-and-drop | Externe Bibliothek von jsDelivr; Worker-/Sprachdateien benötigen Netz/Zugriff. Erkennung erfolgt im Browser; gespeichert wird der übernommene Text, kein Bildoriginal |
| Löschen | Einzelne oder alle Einträge endgültig löschen | Kein Papierkorb und keine 14-Tage-Rückholung |

Beim Import wird vor der Änderung ein Sicherungsdownload ausgelöst. Der Download muss selbst geprüft werden. Ungültige Einträge werden abgelehnt; ein fehlgeschlagener Speichervorgang beim Import lässt die laufende Sammlung unverändert.

Historische Felder wie `coreDriveStatus`, `driveUploadedAt` und `driveFileId` bleiben als Daten erhalten. Sie aktivieren keine Verbindung und werden nicht als aktueller Cloud-Sicherungsstatus angezeigt. Neue JSON-Dateien verwenden `format: "core-sammler-local"`, `schemaVersion: 1`.

## Bewusst noch nicht umgesetzt

- Vollständiger Ablauf SAMMLER → QUARANTÄNE → CORE LAB → LIBRARY → ARCHIV mit technischer Prüfung und Freigabe.
- Erhalt sämtlicher Originaldateien/Herkunftsbelege; globale Dublettenkennzeichnung.
- Papierkorb mit 14 Tagen Rückholfrist, automatischer 7-Tage-Suchlauf und externer manueller SEARCH. Die vorhandene Suche durchsucht nur den lokalen Bestand.
- Vollständige Wiederherstellung von Kategorien/Regeln, belastbare Massendatenhaltung und durchgängige Speicherfehlerbehandlung.
- Service Worker, geprüfter Offline-Start und verlässliche PWA-Installation. Das Manifest allein stellt dies nicht her.
- Anbindung an CORE BASE/LUNA. Google Drive/OAuth ist für diese lokale Linie entfernt und kein offener Pflichtbestandteil.

## Kleinste veröffentlichbare Version und Release-Pfad

**LOCAL v0.6.3** ist die kleinste sinnvolle lokale Basis: vorhandene Erfassung, Organisation, lokale Speicherung, Statuskennzeichen, ID-Dublettenbehandlung und manueller Export/Import. Die oben genannten Grenzen gehören zur Versionsbeschreibung.

Prüfstand vom 20. Oktober 2026: `main` zeigte auf den oben genannten Commit; im Repository lagen nur README und HTML, ohne Tests oder Workflow-Dateien. Die GitHub-Releases-Liste war leer, ein offener PR wurde nicht gefunden. Die aktive Pages-Konfiguration ließ sich über den verfügbaren Zugang nicht auslesen; eine laufende Website wird deshalb nicht behauptet.

Für die Freigabe:

1. Änderungen im Pull Request prüfen; `node tests/local-release.mjs` ausführen. Der Workflow führt dieselbe Prüfung aus.
2. In Safari auf iPhone/iPad und in einem Desktop-Browser mit Testdaten prüfen: Erfassen → neu laden → Status → JSON/Text herunterladen → JSON in leerem Browserprofil importieren. Alte Sicherung und Abbruch ebenfalls prüfen. Kategorien/Regeln beim Import werden nicht wiederhergestellt.
3. Netzwerk prüfen: keine Google-Anmeldung oder Drive-Anfragen; externe OCR-Abhängigkeiten beachten. Bei gesperrtem CDN muss die normale Texteingabe weiterhin nutzbar sein.
4. Erst nach bestandenen Browserprüfungen PR zusammenführen und den geprüften Commit als `v0.6.3` mit diesen Grenzen veröffentlichen. Für eine Website kann anschließend GitHub Pages mit `main` / Repository-Wurzel eingerichtet bzw. die bestehende Konfiguration geprüft werden. Das ist ein eigener Bereitstellungsschritt.

Die beigefügte Prüfung nutzt DOM-Stubs für Datenpfade und ersetzt weder Browser-, Download-, OCR- noch Gerätetests. Sie prüft Syntax/Start, DOM-Verweise, entfernte Google-Pfade, lokale Persistenz, Status, Exporte, alte Importformate, ID-Dubletten sowie ungültige/abgebrochene Importe und Speicherfehler beim Import.
