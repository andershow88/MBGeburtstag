#!/bin/sh
# Schreibt config.js mit dem OpenAI-Key aus der Railway-Env-Variable
# OPEN_AI_KEY beim Container-Start. nginx:alpine fuehrt Scripte aus
# /docker-entrypoint.d/ automatisch vor dem nginx-Start aus.
set -e

HTML_DIR="${HTML_DIR:-/usr/share/nginx/html}"
CONFIG_FILE="${HTML_DIR}/config.js"

if [ -n "${OPEN_AI_KEY}" ]; then
    # JSON-Escape fuer Backslash und Anfuehrungszeichen
    ESCAPED=$(printf '%s' "${OPEN_AI_KEY}" | sed 's/\\/\\\\/g; s/"/\\"/g')
    cat > "${CONFIG_FILE}" <<EOF
// Automatisch generiert durch /docker-entrypoint.d/30-config-js.sh
// aus der Environment-Variable OPEN_AI_KEY (Railway).
window.MB_OPENAI_KEY = "${ESCAPED}";
EOF
    echo "[30-config-js] config.js geschrieben (${#OPEN_AI_KEY} Zeichen)"
else
    # Falls keine Variable gesetzt: leere config.js, damit der <script>-Tag nicht 404 gibt
    echo "// OPEN_AI_KEY nicht gesetzt" > "${CONFIG_FILE}"
    echo "[30-config-js] OPEN_AI_KEY nicht gesetzt — config.js leer"
fi
