alcarin.controller 'MainPageController',

class MainPageController
    characters: [
        {id: '48a74a64dd7fe92507b4bb20efeb99a8', name: 'Arhun'},
        {id: '3483a3eca2d61c2c315b305d3d2dd6c1', name: 'Anhim'}
    ]
    constructor: (@socket)->

    loadCharDescription: (char)->
        console.log char
        # Promise.delay('3000').then ->
        #     console.log char
