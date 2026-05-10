# Image Cropping Guide for Para 7.3

## Overview
The new para73.js structure requires cropped diagram images (individual diagrams, not full pages). Below are the specific crops needed from the three book pages.

---

## From 7.3.1.jpg (Page 1)

### 1. q14_squares.jpg
**Purpose:** Question 14a - Square areas diagram
**Content:** The three squares with sides labeled (4 cm, 5.5 cm, 7 cm)
**Approximate crop box:** Top section of page, showing the squares with measurements
**Use:** Display diagram with question asking to calculate areas

### 2. q14b_table.jpg  
**Purpose:** Question 14b - Empty table to fill
**Content:** Table structure for side and area values
**Approximate crop box:** Below squares, shows empty table to complete
**Use:** Students fill in missing values

### 3. q15_wouter_schema.jpg
**Purpose:** Question 15a - Wouter's (incorrect) Pythagoras schema
**Content:** The schema box with Wouter's approach
**Approximate crop box:** Middle section with the schema frame
**Use:** Students complete Wouter's schema (learning what NOT to do)

### 4. q15_annemiek_schema.jpg
**Purpose:** Question 15b - Annemiek's (correct) Pythagoras schema  
**Content:** The completed schema box with correct method
**Approximate crop box:** Right side, shows proper schema structure
**Use:** Students follow correct approach

---

## From 7.3.2.jpg (Page 2)

### 5. theory_aanpak.jpg
**Purpose:** Theory slide - "Aanpak: Hoe bereken je de langste zijde?"
**Content:** The blue "Aanpak" box with 3-step method + example
**Approximate crop box:** Top blue-highlighted section
**Use:** Educational theory block between Q15 and Q16

### 6. example_triangle_ac.jpg
**Purpose:** Theory example - Triangle AC calculation
**Content:** Example triangle diagram with AC = 5, BC = 3
**Approximate crop box:** Below Aanpak, shows example triangle
**Use:** Illustrate the theory example

### 7. q16_triangle_ghi.jpg
**Purpose:** Question 16 - Triangle GHI diagram
**Content:** Right triangle with sides labeled GH=15, GI=10
**Approximate crop box:** Left side of page, triangle diagram
**Use:** Question 16 exercise

### 8. q17_rectangle.jpg
**Purpose:** Question 17 - Rectangle diagonal diagram
**Content:** Rectangle 30m × 58m with diagonal line
**Approximate crop box:** Right side, rectangle with diagonal
**Use:** Question 17 exercise

---

## From 7.3.3.jpg (Page 3)

### 9. q18_billard_diagram.jpg
**Purpose:** Question 18 - Billard table with measurements
**Content:** Table image with dimensions 106cm × 60cm, diagonal marked
**Approximate crop box:** Top right, billard table image
**Use:** Real-world application question

### 10. q19_roof_photo.jpg
**Purpose:** Question 19a/b - Roof beams photo
**Content:** Actual roof structure photo showing spants
**Approximate crop box:** Left side, wooden roof photo
**Use:** Context/motivation for roof beam calculations

### 11. q19_roof_diagram.jpg
**Purpose:** Question 19a/b - Roof beams diagram
**Content:** Triangle diagram with AD=1.5m, DB=3m, CD=1m
**Approximate crop box:** Right side, geometric roof diagram
**Use:** Calculate AC and BC lengths

### 12. q20_triangle_pqr.jpg
**Purpose:** Question 20 - Triangle PQR
**Content:** Triangle with PR=11cm, QR=60cm
**Approximate crop box:** Middle-bottom, yellow-highlighted triangle
**Use:** Final calculation question

### 13. leerdoelen_triangle_def.jpg
**Purpose:** Learning objectives check - Triangle DEF
**Content:** Triangle with DE=24cm, EF=10cm (green box section)
**Approximate crop box:** Bottom green-highlighted section
**Use:** Learning objectives verification exercise

---

## How to Crop

### Option 1: Using Online Tools
- Upload JPG to an image cropping tool
- Crop to the sections specified above
- Save as JPEG with filename shown above
- Place in: `/boekafbeeldingen/cropped/`

### Option 2: Using Command Line (ImageMagick)
```bash
magick convert 7.3.1.jpg -crop 600x160+80+180 +repage q14_squares.jpg
```

### Option 3: Manual with Photo Editor
- Open JPG in your photo editor (Paint, Photoshop, etc.)
- Select the region
- Crop and export

---

## File Structure
After cropping, create:
```
boekafbeeldingen/
  cropped/
    q14_squares.jpg
    q14b_table.jpg
    q15_wouter_schema.jpg
    q15_annemiek_schema.jpg
    theory_aanpak.jpg
    example_triangle_ac.jpg
    q16_triangle_ghi.jpg
    q17_rectangle.jpg
    q18_billard_diagram.jpg
    q19_roof_photo.jpg
    q19_roof_diagram.jpg
    q20_triangle_pqr.jpg
    leerdoelen_triangle_def.jpg
```

---

## Current Status

✅ para73.js restructured with 31 slides total:
- 1 presentation slide
- 1 intro theory slide  
- 13 exercise slides (Q14a-Q20)
- 2 theory slides (Aanpak + Leerdoelen)
- 1 final check slide
- 1 summary slide
- 1 evaluation intro theory slide
- 4 evaluation question slides
- 1 evaluation summary slide

⏳ Pending: Crop 13 diagram images and place in `/boekafbeeldingen/cropped/`

Once cropped images are in place:
- Frontend will load them automatically
- All questions display with correct diagrams
- Students can work through full para 7.3 digitally

