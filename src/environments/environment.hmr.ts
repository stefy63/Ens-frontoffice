export const environment = {
    production: false,
    hmr       : true,
    version   : '5.1.0',
    analyticsID: 'UA-142899635-1',

    
    // ws_url: 'https://preprodttms.3punto6.com',
    ws_url: 'http://localhost',
    ws_path: '/wss',
    ws_port: 9000,

    // API configuration url
    // api_url: 'https://preprodttms.3punto6.com',
    api_url: 'http://localhost',
    api_port: 3030,
    api_suffix: '/api',

    
    // VideoChat Config
    videoChat_room_suffix: 'Ens_',
    videoChat_server_url: null,


    // redirect url after logout
    return_url: 'login',

};
