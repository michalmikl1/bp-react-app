# bp-angular-app

Angular 17 standalone conversion of the original React task manager.

## Run

```bash
npm install
npm start
```

App routes and behavior replicate the React version:
- `/login`
- `/register`
- `/`
- `/upcoming`
- `/projects/:id`

Uses localStorage for persistence and `bcryptjs` for password hashing.
