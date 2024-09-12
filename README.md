# medpantry-itproject-57

## What is this?

[A set of simple solutions to better integrate Medical Pantry's warehouse and Shopify system](https://medpantry-itproject.atlassian.net/wiki/spaces/SD/overview?homepageId=295019)

--

## Folder Structure
``` bash 
├── README.md
├── backend
│   └── WarehouseInterface
│       ├── HELP.md
│       ├── ...
│       ├── build.gradle
│       └── src
│          ├── main
│         ├── java
│         │   └── org
│         │       └── example
│         │           └── warehouseinterface
│         │               ├── WarehouseInterfaceApplication.java
│         │               ├── api
│         │               │   ├── controller // endpoints go here :)
│         │               │   │   └── BaxterBoxController.java
│         │               │   └── model // database models go here :)
│         │               │       └── BaxterBox.java
│         │               └── service  // business logic goes here :)
│         │                   └── BaxterBoxService.java        
│         └── resources
│             ├── application.properties
│             ├── static
│             └── templates
└── test
    └── java
        └── org
            └── example
                └── warehouseinterface
                    └── WarehouseInterfaceApplicationTests.java
└── frontend
    └── medpantry
        ├── README.md
        ├── app
        ├── components // our front end components get built here :)
          ├── AuthButton.tsx
          ├── DeployButton.tsx
          ├── Header.tsx
          ├── NextLogo.tsx
          ├── SupabaseLogo.tsx
          ├── card.tsx
          ├── sidebar.tsx
          ├── tutorial
          │   ├── Code.tsx
          │   ├── ConnectSupabaseSteps.tsx
          │   ├── FetchDataSteps.tsx
          │   ├── SignUpUserSteps.tsx
          │   └── Step.tsx
          └── ui
              ├── button.tsx
              ├── input.tsx
              └── separator.tsx
        ├── components.json
        ├── lib
        ├── middleware.ts
        ├── next-env.d.ts
        ├── next.config.js
        ├── node_modules
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.js
        ├── tailwind.config.ts
        ├── tsconfig.json
        └── utils

```
---

## Running the project

### Frontend

To run the web-app component of this project, please connect the supabase variables to the `.env.local` file as outlined in the frontend/medpantry/README.md.

Also in `.env.local`, add the server backend link. The server, which hasn't been deployed yet, is hosted on `https://localhost:8080`.

Thus, the `.env.local` file should appear as so:

```
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=XXXXXX
NEXT_PUBLIC_BACKEND_LINK=http://localhost:8080
```


Once this has been filled out, naviagate to `frontend/medpantry/` then execute the following to start the dev server:

```npm run dev```

### Backend

To run the server which hosts the custom API, please create a `.env` file in `backend/WarehouseInterface/main/resources` and populate it with the same API keys as in *frontend/*.

Furthermore, you need to fill in the *Shopify* admin key extracted from the owners page. Thus the `.env` file should appear as so:

```
SUPABASE_URL=XXXXX.supabase.co
SUPABASE_API_KEY=XXXXX

SHOPIFY_ADMIN_KEY=XXXXX
```

To test the API, please use the Postman service, and execute a command like so:
```
localhost:8080/baxterbox?id=2
```
... which fetches the baxter box number 2

---

## Contribution guidelines

Please follow the contribution guidelines, found [here](https://medpantry-itproject.atlassian.net/wiki/spaces/SD/pages/19267585/Development+Practices)
