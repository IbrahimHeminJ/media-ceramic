# Create Tile — API Documentation

## Overview

Creates a new Tile in a single `multipart/form-data` request, including its main
image, PDF spec sheet, laying-pattern orientations, and (optionally) room mockups.
This is an **admin-only** endpoint.

| Property          | Value                       |
| ------------------ | --------------------------- |
| **URL**            | `/api/tiles`                |
| **Method**         | `POST`                      |
| **Auth Required**  | ✅ Yes (Bearer Token)        |
| **Content-Type**   | `multipart/form-data`       |

---

## Request Fields

### Tile fields (top-level form fields)

| Field            | Type     | Required | Notes                                              |
| ---------------- | -------- | :------: | --------------------------------------------------- |
| `name`           | text     | ✅       |                                                     |
| `brand`          | text     | ✅       |                                                     |
| `size`           | text     | ✅       | e.g. `"60x60"`                                     |
| `color`          | text     | ✅       |                                                     |
| `type`           | text     | ✅       | e.g. `"porcelain"`, `"ceramic"`                    |
| `badge`          | text     | ❌       | e.g. `"featured"`, `"new"`, `"popular"`             |
| `description`    | text     | ✅       |                                                     |
| `thickness`      | text     | ✅       | e.g. `"9mm"`                                        |
| `finish`         | text     | ❌       | e.g. `"Matte"`                                      |
| `slipResistance` | text     | ❌       | e.g. `"R10"`                                        |
| `usage`          | text     | ✅       | e.g. `"Floor & Wall"`                               |
| `image`          | file     | ✅       | Main tile swatch image                             |
| `pdf`            | file     | ✅       | Tile spec sheet PDF                                |

### Orientations (laying patterns) — indexed fields, 0 to 4 entries

Each orientation is submitted as a `name`/`image` pair sharing the same index:

```
orientations[0].name
orientations[0].image
orientations[1].name
orientations[1].image
...
```

- Maximum of **4** orientations (indices `0`–`3`), matching the database constraint.
- Both `name` and `image` must be present together for a given index — sending only
  one of the two is a validation error.
- **If no orientations are submitted, one is auto-created** using the tile's main
  `image` (name `"Default"`, `sortOrder` `0`) — orientations are never left empty.

| Field                     | Type | Required                                  |
| ------------------------- | ---- | ------------------------------------------ |
| `orientations[i].name`    | text | Required if `orientations[i].image` is set |
| `orientations[i].image`   | file | Required if `orientations[i].name` is set  |

### Mockups (room installation images) — indexed fields, fully optional

Same indexed shape as orientations, no maximum count, and may be omitted entirely:

```
mockups[0].label
mockups[0].image
mockups[1].label
mockups[1].image
...
```

| Field                | Type | Required                             |
| -------------------- | ---- | -------------------------------------- |
| `mockups[i].label`   | text | Required if `mockups[i].image` is set  |
| `mockups[i].image`   | file | Required if `mockups[i].label` is set  |

---

## File Constraints

| Constraint         | Images (`image`, orientation/mockup images) | PDF (`pdf`)       |
| ------------------ | -------------------------------------------- | ----------------- |
| Allowed types       | `image/jpeg`, `image/jfif`, `image/png`, `image/webp`, `image/gif`, `image/bmp`, `image/tiff`, `image/heic`, `image/heif` (JPG/JPEG/JFIF/PNG/WEBP/GIF/BMP/TIFF/HEIC/HEIF) | `application/pdf` |
| Max size            | 5 MB                                          | 20 MB              |

Files are validated **before** anything is written to disk or saved to the
database — an invalid file rejects the whole request.

---

## Example Request

```bash
curl -X POST http://localhost:8080/api/tiles \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "name=Carrara Elegance" \
  -F "brand=Marazzi" \
  -F "size=60x60" \
  -F "color=white" \
  -F "type=porcelain" \
  -F "badge=featured" \
  -F "description=Inspired by the timeless beauty of Carrara marble." \
  -F "thickness=9mm" \
  -F "finish=Matte" \
  -F "slipResistance=R10" \
  -F "usage=Floor & Wall" \
  -F "image=@swatch.jpg;type=image/jpeg" \
  -F "pdf=@specs.pdf;type=application/pdf" \
  -F "orientations[0].name=Straight Lay" \
  -F "orientations[0].image=@straight-lay.jpg;type=image/jpeg" \
  -F "orientations[1].name=Diagonal 45°" \
  -F "orientations[1].image=@diagonal-45.jpg;type=image/jpeg" \
  -F "mockups[0].label=Bathroom Mockup" \
  -F "mockups[0].image=@bathroom.jpg;type=image/jpeg"
```

---

## Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Tile created successfully",
  "data": {
    "id": 13,
    "name": "Carrara Elegance",
    "brand": "Marazzi",
    "size": "60x60",
    "color": "white",
    "type": "porcelain",
    "badge": "featured",
    "description": "Inspired by the timeless beauty of Carrara marble.",
    "thickness": "9mm",
    "finish": "Matte",
    "slipResistance": "R10",
    "usage": "Floor & Wall",
    "imagePath": "/uploads/tiles/swatch-3f9a2b1c.jpg",
    "pdfPath": "/uploads/documents/specs-8d1e4a90.pdf",
    "createdAt": "2026-09-10T14:00:00+03:00",
    "updatedAt": "2026-09-10T14:00:00+03:00",
    "orientations": [
      {
        "id": 41,
        "name": "Straight Lay",
        "imagePath": "/uploads/orientations/straight-lay-1a2b3c4d.jpg",
        "sortOrder": 0
      },
      {
        "id": 42,
        "name": "Diagonal 45°",
        "imagePath": "/uploads/orientations/diagonal-45-5e6f7a8b.jpg",
        "sortOrder": 1
      }
    ],
    "mockups": [
      {
        "id": 21,
        "label": "Bathroom Mockup",
        "imagePath": "/uploads/mockups/bathroom-9c8d7e6f.jpg"
      }
    ]
  }
}
```

If no orientations are submitted, `data.orientations` will contain exactly one
auto-generated entry reusing the tile's main image:

```json
"orientations": [
  {
    "id": 43,
    "name": "Default",
    "imagePath": "/uploads/tiles/swatch-3f9a2b1c.jpg",
    "sortOrder": 0
  }
]
```

---

## Error Responses

All error responses follow the shared `ErrorResponse` structure used across the API
(see `API_DOCUMENTATION.md`): `timestamp`, `status`, `error`, `message`, `path`, and
an optional `validationErrors` map.

### `400 Bad Request` — Missing Required Field(s)

Returned when one or more required fields (text or file) are missing. Every missing
field is named in `validationErrors`.

```json
{
  "timestamp": "2026-09-10T14:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/tiles",
  "validationErrors": {
    "name": "name is required",
    "pdf": "pdf is required",
    "orientations[1]": "orientations[1].image is required"
  }
}
```

### `400 Bad Request` — Invalid File Type or Size

Returned when an uploaded image/PDF has the wrong content type or exceeds its size
limit.

```json
{
  "timestamp": "2026-09-10T14:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid image file type for 'swatch.avif'. Allowed types: JPG, JPEG, JFIF, PNG, WEBP, GIF, BMP, TIFF, HEIC, HEIF",
  "path": "/api/tiles"
}
```

### `400 Bad Request` — Malformed Multipart Request

Returned when the multipart request body itself is malformed (e.g. corrupt
boundary, exceeds the server's total request size limit).

```json
{
  "timestamp": "2026-09-10T14:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Malformed multipart request",
  "path": "/api/tiles"
}
```

### `401 Unauthorized` — Missing or Invalid Token

```json
{
  "timestamp": "2026-09-10T14:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication is required to access this resource",
  "path": "/api/tiles"
}
```

### `500 Internal Server Error` — Persistence/Storage Failure

Returned if writing files or saving the tile fails unexpectedly. Any files already
written to disk during the failed request are cleaned up automatically.

```json
{
  "timestamp": "2026-09-10T14:00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/tiles"
}
```
