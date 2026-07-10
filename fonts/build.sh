#!/usr/bin/env bash
# Пересборка локальных шрифтов из исходников в .fontsrc/
# Требуется: pip install fonttools brotli
#
# Lato 2.015 (OFL-1.1) — в Google Fonts нет веса Medium/500, поэтому берём полный набор
# из официального Lato 2.0, чтобы метрики всех начертаний совпадали между собой.
# Jost 3.710 (OFL-1.1) — вариативный, инстансим в статические 400 и 500.
set -euo pipefail

cd "$(dirname "$0")/.."
SRC=.fontsrc
OUT=fonts
PY=${PY:-python3}

# Исходники не хранятся в репозитории — качаем при необходимости
LATO=https://raw.githubusercontent.com/betsol/lato-font/master/fonts
JOST=https://raw.githubusercontent.com/google/fonts/main/ofl/jost
mkdir -p "$SRC"
fetch() { [ -s "$2" ] || curl -fsSL --retry 2 -o "$2" "$1"; }
for w in normal medium bold black; do
  fetch "$LATO/lato-$w/lato-$w.woff2" "$SRC/lato-$w.woff2"
done
fetch "$JOST/Jost%5Bwght%5D.ttf" "$SRC/Jost[wght].ttf"

# latin + latin-ext + cyrillic + типографика, используемая на странице
UNICODES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,\
U+2000-206F,U+2074,U+20AC,U+2122,U+2212,U+FEFF,U+FFFD,\
U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116"

subset() { # <input> <output>
  "$PY" -m fontTools.subset "$1" \
    --output-file="$2" \
    --flavor=woff2 \
    --layout-features='kern,liga,calt' \
    --unicodes="$UNICODES" \
    --desubroutinize
}

# --- Lato: 400 / 500 / 700 / 900 ---
subset "$SRC/lato-normal.woff2" "$OUT/lato-400.woff2"
subset "$SRC/lato-medium.woff2" "$OUT/lato-500.woff2"
subset "$SRC/lato-bold.woff2"   "$OUT/lato-700.woff2"
subset "$SRC/lato-black.woff2"  "$OUT/lato-900.woff2"

# --- Jost: вариативный -> статические 400 / 500 ---
for W in 400 500; do
  "$PY" -m fontTools.varLib.instancer "$SRC/Jost[wght].ttf" "wght=$W" \
    -o "$SRC/jost-$W.ttf" >/dev/null
  subset "$SRC/jost-$W.ttf" "$OUT/jost-$W.woff2"
  rm -f "$SRC/jost-$W.ttf"
done

ls -la "$OUT"/*.woff2
