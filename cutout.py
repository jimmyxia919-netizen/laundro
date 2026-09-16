import sys, os
from rembg import remove, new_session
from PIL import Image, ImageOps

session = new_session("u2net")
src = sys.argv[1]
dst = sys.argv[2]
im = Image.open(src)
im = ImageOps.exif_transpose(im).convert("RGB")
im.thumbnail((1000, 1000), Image.LANCZOS)
cut = remove(im, session=session)
bg = Image.new("RGB", cut.size, (255, 255, 255))
bg.paste(cut, mask=cut.split()[3])
bg.save(dst, "JPEG", quality=88, optimize=True, progressive=True)
print("saved", dst, bg.size, round(os.path.getsize(dst) / 1024), "KB")
