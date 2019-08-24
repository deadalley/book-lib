// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  name: 'test',
  localDomain: 'http://localhost:4200',
  rootUrl: '',
  firebaseConfig: {
    apiKey: 'AIzaSyCOJ1FNmdWadfNOCvh3Gu1fPBstpWt33Wc',
    authDomain: 'booklib-834b9.firebaseapp.com',
    databaseURL: 'https://booklib-834b9.firebaseio.com',
    projectId: 'booklib-834b9',
    storageBucket: 'booklib-834b9.appspot.com',
    messagingSenderId: '590001193511',
  },
  auth0Config: {
    clientId: '9DYcDTKbpSlCtB731to7GjxnXg2c9D2P',
    clientSecret:
      'YjktGc6Nvx3TvtpnkWTUtlJrvgXuDDqkuBcgVxDICnTk5ImeCRuyl6e_cxl3IDFp',
    domain: 'deadalley.auth0.com',
    redirectUri: 'http://localhost:4200/dashboard/goodreads',
  },
  goodreadsConfig: {
    key: 'Lxpz447iVHg9nhHt2OCgQ',
    secret: 'Ke2MlJv4ipWVRYARzef5JxYwtZSKWfktRMQZ4i4jSE',
    domain: 'https://www.goodreads.com',
    proxyDomain: 'http://localhost:5000',
  },
  testConfig: {
    email: 'test_ryCSZBFX@test.com',
    password: 'PKRh6VPUxPd3uASC',
    name: 'test_ryCSZBFX',
  },
}
