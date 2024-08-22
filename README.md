# medpantry-itproject-57

## What is this?

---

## Running the project

### Frontend

To run the web-app component of this project, please connect the supabase variables to the `.env.local` file as outlined in the frontend/medpantry/README.md, then:
```npm run dev```

### Backend

To run the server which hosts the custom API, please create a `.env` file in `backend/WarehouseInterface/main/resources` and populate it with the same API keys as in *frontend/*.

To test the API, please use the Postman service, and execute a command like so:
```
localhost:8080/baxterbox?id=2
```
... which fetches the baxter box number 2

---

## Contribution guidelines
