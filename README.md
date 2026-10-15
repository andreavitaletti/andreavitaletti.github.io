venv mkdocs

pandoc -V linkcolor=blue index.md -o cv.pdf

docker run --rm --volume "$(pwd):/data"  --user $(id -u):$(id -g)  pandoc/latex -V linkcolor=blue index.md -o cv.pdf

# Generate Marp slides (PDF / HTML)
npx @marp-team/marp-cli docs/IoTPD/assets/slides.md --pdf -o docs/IoTPD/assets/slides.pdf
npx @marp-team/marp-cli docs/IoTPD/assets/slides.md -o docs/IoTPD/assets/slides.html

# Generate Marp slides via Docker
docker run --rm --init -v "$(pwd):/home/marp/app/" -e MARP_USER="$(id -u):$(id -g)" marpteam/marp-cli docs/IoTPD/assets/slides.md --pdf -o docs/IoTPD/assets/slides.pdf
docker run --rm --init -v "$(pwd):/home/marp/app/" -e MARP_USER="$(id -u):$(id -g)" marpteam/marp-cli docs/IoTPD/assets/slides.md -o docs/IoTPD/assets/slides.html

