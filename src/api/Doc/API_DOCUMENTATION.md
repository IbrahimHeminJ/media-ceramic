# MediaCeramic Backend — API Documentation

## Base URL

```
http://localhost:8080
```

---

## Authentication

All endpoints (except Login) require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Login

Authenticate with username and password to receive a JWT token.

| Property          | Value              |
| ----------------- | ------------------ |
| **URL**           | `/api/auth/login`  |
| **Method**        | `POST`             |
| **Auth Required** | No                 |
| **Content-Type**  | `application/json` |

#### Request Body

| Field      | Type     | Required | Description        |
| ---------- | -------- | -------- | ------------------ |
| `username` | `string` | ✅        | The admin username |
| `password` | `string` | ✅        | The admin password |

#### Example Request

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

#### Success Response — `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcyNTczNTYwMCwiZXhwIjoxNzI1ODIyMDAwfQ.xxxxx",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

| Field        | Type     | Description                                     |
| ------------ | -------- | ----------------------------------------------- |
| `token`      | `string` | The JWT token to use for authenticated requests |
| `token_type` | `string` | Always `"Bearer"`                               |
| `expires_in` | `number` | Token lifetime in seconds (86400 = 24 hours)    |

---

## Social Links

### 2. Get All Social Links *(Public)*

Retrieve all social links. **No authentication required.**

| Property          | Value               |
| ----------------- | ------------------- |
| **URL**           | `/api/social-links` |
| **Method**        | `GET`               |
| **Auth Required** | ❌ No (Public)       |

#### Example Request

```bash
curl -X GET http://localhost:8080/api/social-links
```

#### Success Response — `200 OK`

```json
[
  {
    "id": 1,
    "name": "Instagram — @terratile.co",
    "href": "https://instagram.com/terratile.co",
    "icon": "fa-brands fa-instagram",
    "color": "text-[#E1306C]",
    "createdAt": "2026-09-08T12:00:00+03:00",
    "updatedAt": "2026-09-08T12:00:00+03:00"
  },
  {
    "id": 2,
    "name": "WhatsApp",
    "href": "https://wa.me/1234567890",
    "icon": "fa-brands fa-whatsapp",
    "color": "text-[#25D366]",
    "createdAt": "2026-09-08T12:05:00+03:00",
    "updatedAt": "2026-09-08T12:05:00+03:00"
  }
]
```

Returns an empty array `[]` if no social links exist.

| Field       | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| `id`        | `number` | The social link ID             |
| `name`      | `string` | The display label              |
| `href`      | `string` | The destination URL            |
| `icon`      | `string` | FontAwesome icon class         |
| `color`     | `string` | CSS color class                |
| `createdAt` | `string` | ISO 8601 creation timestamp    |
| `updatedAt` | `string` | ISO 8601 last-update timestamp |

---

### 3. Create Social Link *(Admin)*

Create a new social link button entry. **Requires JWT authentication.**

| Property          | Value                |
| ----------------- | -------------------- |
| **URL**           | `/api/social-links`  |
| **Method**        | `POST`               |
| **Auth Required** | ✅ Yes (Bearer Token) |
| **Content-Type**  | `application/json`   |

#### Request Body

| Field   | Type     | Required | Default              | Description                                        |
| ------- | -------- | -------- | -------------------- | -------------------------------------------------- |
| `name`  | `string` | ✅        | —                    | Display label (e.g. `"Instagram — @terratile.co"`) |
| `href`  | `string` | ✅        | —                    | Destination URL, mailto, or tel link               |
| `icon`  | `string` | ❌        | `"fa-solid fa-link"` | FontAwesome icon class                             |
| `color` | `string` | ❌        | `"text-[#C2784A]"`   | CSS color class or styling token                   |

#### Example Request

```bash
curl -X POST http://localhost:8080/api/social-links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "name": "Instagram — @terratile.co",
    "href": "https://instagram.com/terratile.co",
    "icon": "fa-brands fa-instagram",
    "color": "text-[#E1306C]"
  }'
```

#### Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Social link created successfully",
  "data": {
    "id": 1,
    "name": "Instagram — @terratile.co",
    "href": "https://instagram.com/terratile.co",
    "icon": "fa-brands fa-instagram",
    "color": "text-[#E1306C]",
    "createdAt": "2026-09-08T12:00:00+03:00",
    "updatedAt": "2026-09-08T12:00:00+03:00"
  }
}
```

| Field            | Type      | Description                                      |
| ---------------- | --------- | ------------------------------------------------ |
| `success`        | `boolean` | `true` if the operation succeeded                |
| `message`        | `string`  | Human-readable result description                |
| `data.id`        | `number`  | The auto-generated ID of the created social link |
| `data.name`      | `string`  | The display label                                |
| `data.href`      | `string`  | The destination URL                              |
| `data.icon`      | `string`  | FontAwesome icon class                           |
| `data.color`     | `string`  | CSS color class                                  |
| `data.createdAt` | `string`  | ISO 8601 creation timestamp                      |
| `data.updatedAt` | `string`  | ISO 8601 last-update timestamp                   |

#### Error Responses

| Status             | Cause                                       |
| ------------------ | ------------------------------------------- |
| `400 Bad Request`  | Missing `name` or `href`, or malformed JSON |
| `401 Unauthorized` | Missing or invalid JWT token                |

---

### 4. Delete Social Link *(Admin)*

Permanently delete a social link by its ID.

| Property          | Value                    |
| ----------------- | ------------------------ |
| **URL**           | `/api/social-links/{id}` |
| **Method**        | `DELETE`                 |
| **Auth Required** | ✅ Yes (Bearer Token)     |

#### Path Parameters

| Parameter | Type      | Required | Description                         |
| --------- | --------- | -------- | ----------------------------------- |
| `id`      | `integer` | ✅        | The ID of the social link to delete |

#### Example Request

```bash
curl -X DELETE http://localhost:8080/api/social-links/1 \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Social link deleted successfully",
  "deleted_id": 1
}
```

| Field        | Type      | Description                       |
| ------------ | --------- | --------------------------------- |
| `success`    | `boolean` | `true` if the deletion succeeded  |
| `message`    | `string`  | Human-readable result description |
| `deleted_id` | `number`  | The ID of the deleted social link |

#### Error Responses

| Status             | Cause                                   |
| ------------------ | --------------------------------------- |
| `401 Unauthorized` | Missing or invalid JWT token            |
| `404 Not Found`    | No social link exists with the given ID |

#### 404 Example

```json
{
  "timestamp": "2026-09-08T13:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Social link not found with id: 99",
  "path": "/api/social-links/99"
}
```

---

## Tiles

### 5. Update Tile *(Admin)*

Partially update a tile. Only the fields included in the request are changed — the
rest of the tile is left untouched. Any subset of fields may be sent: just a name,
just a new image, both together, or any other combination. **Requires JWT
authentication.**

| Property          | Value                  |
| ----------------- | ---------------------- |
| **URL**           | `/api/tiles/{id}`      |
| **Method**        | `PATCH`                |
| **Auth Required** | ✅ Yes (Bearer Token)   |
| **Content-Type**  | `multipart/form-data`  |

#### Path Parameters

| Parameter | Type      | Required | Description                    |
| --------- | --------- | -------- | ------------------------------ |
| `id`      | `integer` | ✅        | The ID of the tile to update   |

#### Request Body

Every field below is **optional** — include only the ones you want to change.

| Field            | Type | Description                                                                 |
| ---------------- | ---- | ---------------------------------------------------------------------------- |
| `name`           | text | Tile name                                                                    |
| `brand`          | text | Brand name                                                                   |
| `size`           | text | e.g. `"60x60"`                                                               |
| `color`          | text | Color name                                                                   |
| `type`           | text | e.g. `"porcelain"`, `"ceramic"`                                              |
| `badge`          | text | e.g. `"featured"`, `"new"`, `"popular"`. Send as an empty value to clear it. |
| `description`    | text | Tile description                                                             |
| `thickness`      | text | e.g. `"9mm"`                                                                 |
| `finish`         | text | e.g. `"Matte"`. Send as an empty value to clear it.                          |
| `slipResistance` | text | e.g. `"R10"`. Send as an empty value to clear it.                            |
| `usage`          | text | e.g. `"Floor & Wall"`                                                        |
| `image`          | file | Replaces the tile's main image. Old file is removed after the update.       |
| `pdf`            | file | Replaces the tile's spec sheet PDF. Old file is removed after the update.   |

Rules:

- **At least one field must be provided** — an empty request is rejected.
- Every field except `badge` is required to be **non-blank** *if included* — you may
  omit `name`, but if you send it, it can't be an empty string.
- `image` and `pdf` reuse the same file constraints as
  [Create Tile](CREATE_TILE_API.md#file-constraints): images must be
  JPG/JPEG/JFIF/PNG/WEBP/GIF/BMP/TIFF/HEIC/HEIF (max 5 MB), the PDF must be
  `application/pdf` (max 20 MB).
- Orientations and mockups are not editable through this endpoint.

#### Example Request — rename only

```bash
curl -X PATCH http://localhost:8080/api/tiles/13 \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "name=Carrara Elegance Deluxe"
```

#### Example Request — swap the main image only

```bash
curl -X PATCH http://localhost:8080/api/tiles/13 \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "image=@new-swatch.jpg;type=image/jpeg"
```

#### Example Request — name and image together

```bash
curl -X PATCH http://localhost:8080/api/tiles/13 \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "name=Carrara Elegance Deluxe" \
  -F "image=@new-swatch.jpg;type=image/jpeg"
```

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Tile updated successfully",
  "data": {
    "id": 13,
    "name": "Carrara Elegance Deluxe",
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
    "imagePath": "/uploads/tiles/new-swatch-7f2a9c31.jpg",
    "pdfPath": "/uploads/documents/specs-8d1e4a90.pdf",
    "createdAt": "2026-09-10T14:00:00+03:00",
    "updatedAt": "2026-09-10T15:30:00+03:00",
    "orientations": [
      {
        "id": 41,
        "name": "Straight Lay",
        "imagePath": "/uploads/orientations/straight-lay-1a2b3c4d.jpg",
        "sortOrder": 0
      }
    ],
    "mockups": []
  }
}
```

| Field                   | Type      | Description                                    |
| ----------------------- | --------- | ----------------------------------------------- |
| `success`               | `boolean` | `true` if the update succeeded                  |
| `message`               | `string`  | Human-readable result description               |
| `data.id`                | `number`  | The tile's ID                                   |
| `data.name`              | `string`  | Tile name                                       |
| `data.brand`             | `string`  | Brand name                                      |
| `data.size`              | `string`  | Tile size                                       |
| `data.color`             | `string`  | Color name                                      |
| `data.type`              | `string`  | Tile type                                       |
| `data.badge`             | `string`  | Badge label, or `null` if not set               |
| `data.description`       | `string`  | Tile description                                |
| `data.thickness`         | `string`  | Tile thickness                                  |
| `data.finish`            | `string`  | Tile finish                                     |
| `data.slipResistance`    | `string`  | Slip resistance rating                          |
| `data.usage`             | `string`  | Recommended usage                               |
| `data.imagePath`         | `string`  | Path to the tile's main image                   |
| `data.pdfPath`           | `string`  | Path to the tile's spec sheet PDF, or `null`    |
| `data.createdAt`         | `string`  | ISO 8601 creation timestamp                     |
| `data.updatedAt`         | `string`  | ISO 8601 last-update timestamp                  |
| `data.orientations`      | `array`   | The tile's laying-pattern orientations          |
| `data.mockups`           | `array`   | The tile's room installation mockups            |

#### Error Responses

| Status               | Cause                                                          |
| --------------------- | --------------------------------------------------------------- |
| `400 Bad Request`     | No fields provided in the request                              |
| `400 Bad Request`     | A provided field (other than `badge`) is blank                 |
| `400 Bad Request`     | Invalid file type/size for `image` or `pdf`                    |
| `400 Bad Request`     | Malformed multipart request (e.g. no body, wrong Content-Type) |
| `401 Unauthorized`    | Missing or invalid JWT token                                    |
| `404 Not Found`       | No tile exists with the given `id`                              |
| `500 Internal Server Error` | Unexpected failure while saving the update                |

#### `400 Bad Request` — No Fields Provided

```json
{
  "timestamp": "2026-09-10T15:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/tiles/13",
  "validationErrors": {
    "request": "At least one field must be provided to update"
  }
}
```

#### `400 Bad Request` — Blank Field

```json
{
  "timestamp": "2026-09-10T15:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/tiles/13",
  "validationErrors": {
    "brand": "brand cannot be blank"
  }
}
```

#### `404 Not Found` — Tile Doesn't Exist

```json
{
  "timestamp": "2026-09-10T15:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Tile not found with id: 99999",
  "path": "/api/tiles/99999"
}
```

---

### 6. Get All Tiles *(Public)*

Retrieve every tile, including its main image, PDF, orientations, and mockups.
Used for public catalog rendering. **No authentication required.**

| Property          | Value         |
| ----------------- | ------------- |
| **URL**           | `/api/tiles`  |
| **Method**        | `GET`         |
| **Auth Required** | ❌ No (Public) |

#### Example Request

```bash
curl -X GET http://localhost:8080/api/tiles
```

#### Success Response — `200 OK`

```json
[
  {
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
]
```

Returns an empty array `[]` if no tiles exist.

| Field                   | Type      | Description                                   |
| ------------------------ | --------- | ---------------------------------------------- |
| `id`                     | `number`  | The tile's ID                                  |
| `name`                   | `string`  | Tile name                                      |
| `brand`                  | `string`  | Brand name                                     |
| `size`                   | `string`  | Tile size                                      |
| `color`                  | `string`  | Color name                                     |
| `type`                   | `string`  | Tile type                                      |
| `badge`                  | `string`  | Badge label, or `null` if not set              |
| `description`            | `string`  | Tile description                               |
| `thickness`              | `string`  | Tile thickness                                 |
| `finish`                 | `string`  | Tile finish                                    |
| `slipResistance`         | `string`  | Slip resistance rating                         |
| `usage`                  | `string`  | Recommended usage                              |
| `imagePath`              | `string`  | Path to the tile's main image                  |
| `pdfPath`                | `string`  | Path to the tile's spec sheet PDF, or `null`   |
| `createdAt`              | `string`  | ISO 8601 creation timestamp                    |
| `updatedAt`              | `string`  | ISO 8601 last-update timestamp                 |
| `orientations`           | `array`   | The tile's laying-pattern orientations         |
| `orientations[].id`      | `number`  | Orientation ID                                 |
| `orientations[].name`    | `string`  | Orientation name (e.g. `"Straight Lay"`)       |
| `orientations[].imagePath` | `string` | Path to the orientation's image               |
| `orientations[].sortOrder` | `number` | Display order, `0`–`3`                        |
| `mockups`                | `array`   | The tile's room installation mockups           |
| `mockups[].id`           | `number`  | Mockup ID                                      |
| `mockups[].label`        | `string`  | Mockup label (e.g. `"Bathroom Mockup"`)        |
| `mockups[].imagePath`    | `string`  | Path to the mockup's image                     |

All image/PDF paths are served directly by the backend and can be fetched as-is,
e.g. `http://localhost:8080/uploads/tiles/swatch-3f9a2b1c.jpg` (no authentication
required).

---

### 7. Delete Tile *(Admin)*

Permanently delete a tile by its ID, including its orientation/mockup records and
the underlying image/PDF files on disk. **Requires JWT authentication.**

| Property          | Value                 |
| ----------------- | --------------------- |
| **URL**           | `/api/tiles/{id}`     |
| **Method**        | `DELETE`               |
| **Auth Required** | ✅ Yes (Bearer Token)  |

#### Path Parameters

| Parameter | Type      | Required | Description                  |
| --------- | --------- | -------- | ----------------------------- |
| `id`      | `integer` | ✅        | The ID of the tile to delete |

#### Example Request

```bash
curl -X DELETE http://localhost:8080/api/tiles/13 \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Tile deleted successfully",
  "deleted_id": 13
}
```

| Field        | Type      | Description                       |
| ------------ | --------- | ---------------------------------- |
| `success`    | `boolean` | `true` if the deletion succeeded  |
| `message`    | `string`  | Human-readable result description |
| `deleted_id` | `number`  | The ID of the deleted tile        |

#### Error Responses

> **Note:** unlike other endpoints in this API, Delete Tile does **not** use the
> shared `ErrorResponse` shape below for its 404 and 500 cases — it always returns
> the same `{ success, message }` shape as its success response, so callers can
> check `success` without branching on status code.

| Status                       | Cause                              |
| ----------------------------- | ------------------------------------ |
| `401 Unauthorized`            | Missing or invalid JWT token        |
| `404 Not Found`               | No tile exists with the given `id`  |
| `500 Internal Server Error`   | Unexpected failure during deletion  |

#### `404 Not Found` Example

```json
{
  "success": false,
  "message": "Tile not found"
}
```

#### `500 Internal Server Error` Example

```json
{
  "success": false,
  "message": "Failed to delete tile"
}
```

---

### Error Responses

All error responses follow a consistent JSON structure:

```json
{
  "timestamp": "2026-09-07T21:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password",
  "path": "/api/auth/login"
}
```

| Field              | Type     | Description                                |
| ------------------ | -------- | ------------------------------------------ |
| `timestamp`        | `string` | ISO 8601 timestamp of the error            |
| `status`           | `number` | HTTP status code                           |
| `error`            | `string` | HTTP status reason phrase                  |
| `message`          | `string` | Human-readable error description           |
| `path`             | `string` | The request URI that caused the error      |
| `validationErrors` | `object` | *(Optional)* Field-level validation errors |

---

### Error Codes Reference

#### `401 Unauthorized` — Invalid Credentials

Returned when the username or password is incorrect.

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "wrongpassword"
  }'
```

```json
{
  "timestamp": "2026-09-07T21:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password",
  "path": "/api/auth/login"
}
```

> **Note:** The same error message is returned for both wrong username and wrong password to prevent user enumeration attacks.

---

#### `400 Bad Request` — Validation Errors

Returned when required fields are missing or blank.

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "",
    "password": ""
  }'
```

```json
{
  "timestamp": "2026-09-07T21:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/auth/login",
  "validationErrors": {
    "username": "Username is required",
    "password": "Password is required"
  }
}
```

---

#### `400 Bad Request` — Malformed Request Body

Returned when the JSON body is malformed or unreadable.

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d 'not valid json'
```

```json
{
  "timestamp": "2026-09-07T21:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Malformed request body",
  "path": "/api/auth/login"
}
```

---

#### `401 Unauthorized` — Missing or Invalid Token

Returned when accessing a protected endpoint without a valid JWT token.

```bash
curl -X GET http://localhost:8080/api/some-protected-resource
```

```json
{
  "timestamp": "2026-09-07T21:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication is required to access this resource",
  "path": "/api/some-protected-resource"
}
```

---

#### `403 Forbidden` — Access Denied

Returned when the user is authenticated but not authorized for the resource.

```json
{
  "timestamp": "2026-09-07T21:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied",
  "path": "/api/restricted-resource"
}
```

---

#### `500 Internal Server Error` — Unexpected Error

Returned when an unexpected server-side error occurs.

```json
{
  "timestamp": "2026-09-07T21:00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/auth/login"
}
```

---

## Using the Token

After a successful login, include the token in the `Authorization` header of all subsequent requests:

```bash
curl -X GET http://localhost:8080/api/some-protected-endpoint \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcyNTczNTYwMCwiZXhwIjoxNzI1ODIyMDAwfQ.xxxxx"
```

---

## Token Details

| Property       | Value               |
| -------------- | ------------------- |
| **Algorithm**  | HMAC-SHA256 (HS256) |
| **Expiration** | 24 hours            |
| **Subject**    | Username            |
| **Token Type** | Bearer              |

### Token Payload (decoded)

```json
{
  "sub": "admin",
  "iat": 1725735600,
  "exp": 1725822000
}
```

| Claim | Description                                           |
| ----- | ----------------------------------------------------- |
| `sub` | Subject — the authenticated username                  |
| `iat` | Issued At — Unix timestamp when the token was created |
| `exp` | Expiration — Unix timestamp when the token expires    |

---

## Default Credentials

| Username | Password   |
| -------- | ---------- |
| `admin`  | `admin123` |

> ⚠️ **Important:** Change the default password in production.
