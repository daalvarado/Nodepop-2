# Nodepop v2

## Diego Alvarado

Practica de Back End Avanzado

Users:

    email: popeye@espinacas.com
    pw: keepcoding

    email: mariomario@nintendo2.com
    pw: nodenode

    email: user@example.com
    pw: 1234

API paths:

    ad list:
        localhost:3000/api/ads [GET]    (header: {x-access-token: token received})
                                        (header: {Accept: application-json})

    user list:
        localhost:3000/api/users [GET]  (header: {x-access-token: token received})
                                        (header: {Accept: application-json})

    get token:
        localhost:3000/authenticate [POST] (put email and password in Body)
