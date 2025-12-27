---
description: Mineral image generation prompt template for LITHOS project
---

# Mineral Image Prompt Template

Use this template when generating new mineral images for the LITHOS project.

## Base Prompt

```
A cute, minimalistic 3D illustration designed as a collectible game asset.

A large [MINERAL_NAME] crystal rendered with scientifically accurate mineral crystal habit and symmetry:
[CRYSTAL_SYSTEM] crystal system,
[CRYSTAL_HABIT_DESCRIPTION],
clearly defined flat crystal faces,
sharp edges and proper geometric proportions.

The crystal color matches natural mineral characteristics:
[MINERAL_COLOR_DESCRIPTION],
slightly translucent with subtle internal refraction.

All crystal edges and faces are outlined with a clean, solid white border,
giving a stylized toy-like appearance similar to a museum display model.

Next to the crystal stands a small, randomly chosen cute animal character
(chibi proportions, rounded shapes, simplified features),
gently interacting with the crystal by hugging, leaning, or touching it.
The animal should appear curious and friendly, not dominant.

The scene is set on a soft neutral background with studio-style lighting,
gentle shadows beneath the crystal,
a few small broken crystal fragments scattered on the ground.

Style:
whimsical, cozy, educational,
high-quality 3D game illustration,
soft lighting, smooth surfaces,
no text, no UI, no watermark.
```

## Variables to Replace

- `[MINERAL_NAME]` - Name of the mineral (e.g., "Alexandrite", "Sphalerite")
- `[CRYSTAL_SYSTEM]` - Crystal system (cubic, hexagonal, trigonal, orthorhombic, tetragonal, monoclinic, triclinic)
- `[CRYSTAL_HABIT_DESCRIPTION]` - Description of crystal shape (e.g., "prismatic hexagonal columns", "dodecahedral habit")
- `[MINERAL_COLOR_DESCRIPTION]` - Color characteristics (e.g., "deep purple with violet highlights", "golden honey yellow")

## Special Rule: Small Crystal Minerals

**For minerals that naturally occur as very small crystals in nature**, do NOT draw a single giant crystal. Instead, use the following modified prompt structure:

```
A cute, minimalistic 3D illustration designed as a collectible game asset.

A piece of [MATRIX_ROCK] matrix with many small [MINERAL_NAME] crystals growing on its surface,
rendered with scientifically accurate mineral crystal habit:
[CRYSTAL_SYSTEM] crystal system,
[SMALL_CRYSTAL_DESCRIPTION],
many tiny sparkly crystals clustered together on the host rock.

The mineral color matches natural characteristics:
[MINERAL_COLOR_DESCRIPTION].

All edges are outlined with a clean, solid white border,
giving a stylized toy-like appearance similar to a museum display model.

Next to the specimen stands a small cute chibi [ANIMAL] character.
The scene is set on a soft neutral background with studio-style lighting.

Style: whimsical, cozy, educational, high-quality 3D game illustration,
soft lighting, smooth surfaces, no text, no UI, no watermark.
```

**Examples of small crystal minerals:**
- Uvarovite (鈣鉻榴石) - tiny druzy crystals on matrix
- Millerite (針鎳礦) - hairlike needle crystals
- Vanadinite (釩鉛礦) - small hexagonal crystals on matrix
- Pyromorphite (磷氯鉛礦) - small barrel crystals on matrix

## Example Usage

For Alexandrite:
```
A cute, minimalistic 3D illustration designed as a collectible game asset.

A large Alexandrite crystal rendered with scientifically accurate mineral crystal habit and symmetry:
orthorhombic crystal system,
cyclic twin crystals with tabular habit,
clearly defined flat crystal faces,
sharp edges and proper geometric proportions.

The crystal color matches natural mineral characteristics:
color-changing from emerald green to raspberry red with alexandrite effect,
slightly translucent with subtle internal refraction.

All crystal edges and faces are outlined with a clean, solid white border,
giving a stylized toy-like appearance similar to a museum display model.

Next to the crystal stands a small, randomly chosen cute animal character
(chibi proportions, rounded shapes, simplified features),
gently interacting with the crystal by hugging, leaning, or touching it.
The animal should appear curious and friendly, not dominant.

The scene is set on a soft neutral background with studio-style lighting,
gentle shadows beneath the crystal,
a few small broken crystal fragments scattered on the ground.

Style:
whimsical, cozy, educational,
high-quality 3D game illustration,
soft lighting, smooth surfaces,
no text, no UI, no watermark.
```
