// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr       : false,
    version   : '5.0.0',


    // ws_url: 'https://preprodttms.3punto6.com',
    ws_url: 'http://localhost',
    ws_path: '/wss',
    ws_port: 9000,

    // API configuration url
    // api_url: 'https://preprodttms.3punto6.com',
    api_url: 'http://localhost',
    api_port: 3030,
    api_suffix: '/api',
};
