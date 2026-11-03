venv mkdocs

pandoc -V linkcolor=blue index.md -o cv.pdf

docker run --rm --volume "$(pwd):/data"  --user $(id -u):$(id -g)  pandoc/latex -V linkcolor=blue index.md -o cv.pdf

# Generate Marp slides (PDF / HTML)
npx @marp-team/marp-cli docs/IoTPD/assets/slides.md --pdf -o docs/IoTPD/assets/slides.pdf
npx @marp-team/marp-cli docs/IoTPD/assets/slides.md -o docs/IoTPD/assets/slides.html

# Generate Marp slides via Docker
docker run --rm --init -v "$(pwd):/home/marp/app/" -e MARP_USER="$(id -u):$(id -g)" marpteam/marp-cli docs/IoTPD/assets/slides.md --pdf -o docs/IoTPD/assets/slides.pdf
docker run --rm --init -v "$(pwd):/home/marp/app/" -e MARP_USER="$(id -u):$(id -g)" marpteam/marp-cli docs/IoTPD/assets/slides.md -o docs/IoTPD/assets/slides.html

# Export to pdf

```
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
mdpdf() {
  local in="$1" dir base tmp
  [ -f "$in" ] || { echo "usage: mdpdf file.md" >&2; return 1; }
  dir="$(dirname "$in")"; base="$(basename "${in%.*}")"
  tmp="$dir/.$base.mdpdf.md"            # next to the original, so relative image paths still work
  if grep -q '^```mermaid' "$in"; then
    npx --yes -p @mermaid-js/mermaid-cli mmdc -q -i "$in" -o "$tmp" -e svg || return 1
  else
    cp "$in" "$tmp"
  fi
  npx --yes md-to-pdf "$tmp" >/dev/null && mv "$dir/.$base.mdpdf.pdf" "$dir/$base.pdf" && echo "→ $dir/$base.pdf"
  rm -f "$tmp" "$dir/.$base.mdpdf"-*.svg
}
```

```
mdpdf README.md
```

If you want it, add this to ~/.bashrc
