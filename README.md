# Submissions API

Express + TypeScript API: middleware chain, centralized errors, Multer -> Cloudinary uploads, Zod validation, Nodemailer confirmation emails.

## Setup
```bash
npm install
cp .env.example .env   # then fill in the values below
npm run dev            # or: npm run build && npm start
```

### Environment variables
| Variable | Purpose 
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | SMTP server credentials (Mailtrap is great for testing) |
| `EMAIL_FROM` | Sender shown on confirmation emails |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `PORT` | Optional, defaults to 3000 |

The app exits at startup if any required variable is missing.

## Endpoints
- `POST /submissions` - multipart/form-data: `name`, `email`, `message`, optional `attachment` (PDF/PNG/JPEG, max 5MB). Limited to 5 per IP per hour.
- `GET /submissions/:id` - fetch one submission (id must be a UUID).

```bash
curl -F name="Ada" -F email=ada@example.com -F message="Hello, this is a test" -F attachment=@file.pdf http://localhost:3000/submissions
```

## Error shape (every error path)
```json
{ "success": false, "error": { "statusCode": 400, "message": "Validation failed", "details": [] } }
```

Note: submissions are stored in memory (`utils/store.ts`) and reset on restart.
