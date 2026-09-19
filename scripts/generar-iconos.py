#!/usr/bin/env python3
"""
Genera los íconos del sitio a partir del isologo dorado del manual de marca.

El logo original (`public/branding/isologo-dorado.png`) es el escudo con la P en
dorado #c09e56 sobre fondo transparente y llena el lienzo de borde a borde. Acá se
lo centra, con aire alrededor, sobre un cuadrado del navy del sitio (#080f24, el
mismo de Hero y Footer): así el ícono se ve tanto en pestañas con tema claro como
oscuro, y queda en azul y dorado como pidió el cliente.

Los tamaños chicos llevan un tratamiento distinto: las líneas finas de la columna
se empastan al bajar a 16 px, así que ahí el logo se agranda y se le aplica un
realce de bordes. A tamaño grande eso endurecería el trazo, por eso no se aplica.

Uso:  python3 scripts/generar-iconos.py
Requiere Pillow. Solo hay que volver a correrlo si cambia el logo de marca.
"""

from pathlib import Path

from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "public" / "branding" / "isologo-dorado.png"

NAVY = (8, 15, 36, 255)  # #080f24 — navy-950 de tailwind.config.ts

# Hasta este lado (inclusive) el ícono se trata como "chico".
LIMITE_CHICO = 48
ESCALA_CHICA = 0.90
ESCALA_GRANDE = 0.78

SALIDAS = [
    (RAIZ / "src" / "app" / "icon.png", 512),
    (RAIZ / "src" / "app" / "apple-icon.png", 180),
    (RAIZ / "public" / "icon-192.png", 192),
    (RAIZ / "public" / "icon-512.png", 512),
]
ICO = RAIZ / "src" / "app" / "favicon.ico"
ICO_TAMANOS = [16, 32, 48]


def componer(lado: int) -> Image.Image:
    """Cuadrado navy opaco de `lado` px con el logo dorado centrado."""
    chico = lado <= LIMITE_CHICO
    logo = Image.open(ORIGEN).convert("RGBA")

    objetivo = round(lado * (ESCALA_CHICA if chico else ESCALA_GRANDE))
    # El logo es casi cuadrado (596x578): se escala por el lado más largo para no
    # deformarlo.
    factor = objetivo / max(logo.size)
    logo = logo.resize(
        (max(1, round(logo.width * factor)), max(1, round(logo.height * factor))),
        Image.LANCZOS,
    )

    lienzo = Image.new("RGBA", (lado, lado), NAVY)
    lienzo.alpha_composite(logo, ((lado - logo.width) // 2, (lado - logo.height) // 2))

    # Los íconos de iOS no admiten transparencia; el fondo navy ya es opaco.
    salida = lienzo.convert("RGB")
    if chico:
        salida = salida.filter(
            ImageFilter.UnsharpMask(radius=1, percent=160, threshold=0)
        )
    return salida


def main() -> None:
    if not ORIGEN.exists():
        raise SystemExit(f"No encuentro el logo en {ORIGEN}")

    for destino, lado in SALIDAS:
        destino.parent.mkdir(parents=True, exist_ok=True)
        componer(lado).save(destino, "PNG", optimize=True)
        print(f"  {destino.relative_to(RAIZ)}  {lado}x{lado}")

    # Pillow reescala solo si se le pasa `sizes`, y eso se saltearía el tratamiento
    # por tamaño. Armamos cada resolución a mano y las juntamos en el .ico.
    caras = [componer(n) for n in ICO_TAMANOS]
    caras[-1].save(
        ICO, "ICO", sizes=[(n, n) for n in ICO_TAMANOS], append_images=caras[:-1]
    )
    print(f"  {ICO.relative_to(RAIZ)}  {'/'.join(str(n) for n in ICO_TAMANOS)}")


if __name__ == "__main__":
    main()
