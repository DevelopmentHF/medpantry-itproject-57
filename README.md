# medpantry-itproject-57

## What is this?

[A set of simple solutions to better integrate Medical Pantry's warehouse and Shopify system](https://medpantry-itproject.atlassian.net/wiki/spaces/SD/overview?homepageId=295019)

--

## Folder Structure

├── README.md <br>
├── backend <br>
│   └── WarehouseInterface <br>
│       ├── HELP.md <br>
│       ├── ... <br>
│       ├── build.gradle <br>
│       └── src <br>
│           ├── main <br>
│           │   ├── java <br>
│           │   │   └── org <br>
│           │   │       └── example <br>
│           │   │           └── warehouseinterface <br>
│           │   │               ├── WarehouseInterfaceApplication.java <br>
│           │   │               ├── api <br>
│           │   │               │   ├── controller // endpoints go here :) <br>
│           │   │               │   │   └── BaxterBoxController.java <br>
│           │   │               │   └── model // database models go here :) <br>
│           │   │               │       └── BaxterBox.java <br>
│           │   │               └── service  // business logic goes here :) <br>
│           │   │                   └── BaxterBoxService.java <br>       
│           └── resources <br>
│               ├── application.properties <br>
│               ├── static <br>
│               └── templates <br>
└── test <br>
    └── java <br>
        └── org <br>
            └── example <br>
                └── warehouseinterface <br>
                    └── WarehouseInterfaceApplicationTests.java <br>
└── frontend <br>
    └── medpantry <br>
        ├── README.md <br>
        ├── app <br>
        ├── components // our front-end components get built here :) <br>
        │   ├── AuthButton.tsx <br>
        │   ├── DeployButton.tsx <br>
        │   ├── Header.tsx <br>
        │   ├── NextLogo.tsx <br>
        │   ├── SupabaseLogo.tsx <br>
        │   ├── card.tsx <br>
        │   ├── sidebar.tsx <br>
        │   └── tutorial <br>
        │       ├── Code.tsx <br>
        │       ├── ConnectSupabaseSteps.tsx <br>
        │       ├── FetchDataSteps.tsx <br>
        │       ├── SignUpUserSteps.tsx <br>
        │       └── Step.tsx <br>
        └── ui <br>
            ├── button.tsx <br>
            ├── input.tsx <br>
            └── separator.tsx <br>
        ├── components.json <br>
        ├── tailwind.config.ts <br>
        ├── tsconfig.json <br>
        └── utils <br>

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

Please follow the contribution guidelines, found [here](https://medpantry-itproject.atlassian.net/wiki/spaces/SD/pages/19267585/Development+Practices)
