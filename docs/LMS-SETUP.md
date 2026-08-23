# LMS Setup

The app now supports LMS export in two levels.

## Works without credentials

From the Result toolbar:

- **Google Classroom JSON** downloads a `courses.courseWork.create` request body.
- **Canvas QTI ZIP** downloads a QTI package for Canvas quiz/question-bank import.

These are useful when institution policy does not allow direct API access.

## Credential-dependent API routes

Google Classroom:

```text
POST /api/lms/google-classroom/coursework
```

Environment:

```env
GOOGLE_CLASSROOM_ACCESS_TOKEN=
```

This token must come from a real Google OAuth consent flow with Classroom coursework permission. The API creates draft coursework through Google Classroom's `courses.courseWork.create` method.

Canvas:

```text
POST /api/lms/canvas/assignment
```

Environment:

```env
CANVAS_BASE_URL=https://your-school.instructure.com
CANVAS_ACCESS_TOKEN=
```

The route creates a draft Canvas assignment with online text entry submission.

## Production note

Do not hard-code a personal teacher token for multi-user production. A proper launch should store per-teacher OAuth/API tokens securely and refresh/revoke them according to the institution's policy.
