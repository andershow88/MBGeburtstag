#!/bin/sh
# Schreibt config.js mit dem OpenAI-Key aus der Railway-Env-Variable
# OPENAI_API_KEY beim Container-Start. nginx:alpine fuehrt Scripte aus
# /docker-entrypoint.d/ automatisch vor dem nginx-Start aus.
set -e

HTML_DIR="${HTML_DIR:-/usr/share/nginx/html}"
CONFIG_FILE="${HTML_DIR}/config.js"

if [ -n "${OPENAI_API_KEY}" ]; then
    # JSON-Escape fuer Backslash und Anfuehrungszeichen
    ESCAPED=$(printf '%s' "${OPENAI_API_KEY}" | sed 's/\\/\\\\/g; s/"/\\"/g')
    cat > "${CONFIG_FILE}" <<EOF
// Automatisch generiert durch /docker-entrypoint.d/30-config-js.sh
// aus der Environment-Variable OPENAI_API_KEY (Railway).
window.MB_OPENAI_KEY = "${ESCAPED}";
EOF
    echo "[30-config-js] config.js geschrieben (${#OPENAI_API_KEY} Zeichen)"
else
    # Falls keine Variable gesetzt: leere config.js, damit der <script>-Tag nicht 404 gibt
    echo "// OPENAI_API_KEY nicht gesetzt" > "${CONFIG_FILE}"
    echo "[30-config-js] OPENAI_API_KEY nicht gesetzt — config.js leer"
fi
