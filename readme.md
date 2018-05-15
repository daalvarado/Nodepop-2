# Nodepop v2

## Diego Alvarado

### URL con la practica: https://nodepop.diegoalvarado.net \*\* http://34.229.48.241

Practica de Back End Avanzado

### Setting up environment:

    load node_modules: npm install
    Set up variables.env file -> based on variables.env.example
    Load database: npm run dbinit

    start app service: **npm run dev** (this also starts photo microservice)
    start app service with cluster: **npm run dev-cluster** (this also starts photo microservice)

    start test (with mocha): **npm run e2e** (app service must be running)

    open web app in browser: http://localhost:(port specified in variables.env)

### Existing Users (additonal users can be created using /register path):

    email: popeye@espinacas.com
    pw: keepcoding

    email: mariomario@nintendo2.com
    pw: nodenode

    email: user@example.com
    pw: 1234

### API paths:

    ad list:
        localhost:3000/api/ads [GET]    (postman header: {x-access-token: token received})
                                        (postman header: {Accept: application-json})

    user list:
        localhost:3000/api/users [GET]  (postman header: {x-access-token: token received})
                                        (postman header: {Accept: application-json})

    get token:
        localhost:3000/authenticate [POST] (postman: put email and password in Body)
