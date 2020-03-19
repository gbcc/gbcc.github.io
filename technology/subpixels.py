import numpy as np
import matplotlib.pyplot as plt

# GBC subpixel colours
r = np.array([255, 113, 69]) / 255
g = np.array([193, 214, 80]) / 255
b = np.array([59, 206, 255]) / 255

def circ(x, r):
    return np.sqrt(np.maximum(r**2 - x**2, 0)) / r

n = 10001
x = np.linspace(0, 1/160, n)

# Offset hemispheres, as used in GBCC
yr = np.mod(x * 160 * 7 + 3, 7) - 3
zr = circ(yr, 2)

yg = np.mod(x * 160 * 7 + 1, 7) - 3
zg = circ(yg, 2)

yb = np.mod(x * 160 * 7 + 5, 7) - 2
zb = circ(yb, 2)

plt.figure()

# Add colour profiles together, clamping to [0, 1]
rr = np.minimum(zr * r[0] + zg * g[0] + zb * b[0], 1)
gg = np.minimum(zr * r[1] + zg * g[1] + zb * b[1], 1)
bb = np.minimum(zr * r[2] + zg * g[2] + zb * b[2], 1)

yy = np.maximum(np.maximum(zr, zg), zb)

# Draw individual rectangles with solid colours to produce gradient
s = int(n / 1000)
for i in range(0, n-s, s):
    idx = i + int((s + 1) / 2)
    plt.fill_between(x[i:i + s + 1] * 160, 0, yy[i:i + s + 1], color=(rr[idx], gg[idx], bb[idx]))

plt.show()
