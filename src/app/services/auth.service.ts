import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {
  clientID = 'OSEY6iRBUYhvgbO668RtVYFDkyp118Qw';
  clientSecrent = 'kPgGPxwHJCi_UCQas1SKkEqdvxY8lih9GMdRrEmtLDvSKpw60Bkv2vvO6R9xxiwg';

  domain = 'deadalley.auth0.com';
  redirectUri = 'http://localhost:4200/redirect';

  api_headers: any;
  api_options: any;

  private auth0 = new auth0.WebAuth({
    clientID: this.clientID,
    domain: this.domain,
    responseType: 'token id_token',
    audience: 'https://deadalley.auth0.com/userinfo',
    redirectUri: this.redirectUri,
    scope: 'openid profile'
  });

  constructor(
    private http: Http,
    private fire: AngularFireAuth,
    private router: Router
  ) {
    let body_tk = {
      grant_type: 'client_credentials',
      client_id: 'OSEY6iRBUYhvgbO668RtVYFDkyp118Qw',
      client_secret: 'kPgGPxwHJCi_UCQas1SKkEqdvxY8lih9GMdRrEmtLDvSKpw60Bkv2vvO6R9xxiwg',
      audience: 'https://deadalley.auth0.com/api/v2/'
    };
    /*
    let body_gr = {
      name: 'custom-goodreads',
      strategy: 'oauth1',
      enabled_clients: [ 'OSEY6iRBUYhvgbO668RtVYFDkyp118Qw' ],
      options: {
        client_id: 'Lxpz447iVHg9nhHt2OCgQ',
        client_secret: 'Ke2MlJv4ipWVRYARzef5JxYwtZSKWfktRMQZ4i4jSE',
        requestTokenURL: 'http://www.goodreads.com/oauth/request_token',
        accessTokenURL: 'http://www.goodreads.com/oauth/access_token',
        userAuthorizationURL: 'http://www.goodreads.com/oauth/authorize',
        scripts: { fetchUserProfile: 'function(token, tokenSecret, ctx, cb) {var OAuth = new require("oauth").OAuth; var parser = require(\'xml2json\'); var oauth = new OAuth(ctx.requestTokenURL, ctx.accessTokenURL, ctx.client_id, ctx.client_secret, "1.0", null, "HMAC-SHA1"); oauth.get("https://www.goodreads.com/api/auth_user", token, tokenSecret, function(e, xml, r) { console.log(xml); if (e) return cb(e); if (r.statusCode !== 200) return cb(new Error("StatusCode: " + r.statusCode)); try { var jsonResp = JSON.parse(parser.toJson(xml)); var user = jsonResp.GoodreadsResponse.user; cb(null, user); } catch (e) { console.log(e); cb(new UnauthorizedError("[+] fetchUserProfile: Goodreads fetch script failed. Check Webtask logs")); } });}'}
      }
    }

    this.http.post('https://deadalley.auth0.com/oauth/token', body_tk)
        .map(res => res.json())
        .mergeMap(data => {
          this.token = data.access_token;
          let headers = new Headers({ authorization: 'Bearer ' + this.token });
          let options = new RequestOptions({ headers: headers});
          return this.http.post('https://deadalley.auth0.com/api/v2/connections', body_gr, options);
        })
        .map((res:Response) => res.json())
        .subscribe(res => {
          console.log(this.token)
        })*/

    this.http.post('https://deadalley.auth0.com/oauth/token', body_tk)
        .map(res => res.json())
        .subscribe(data => {
          let token = data.access_token;
          localStorage.setItem('api_access_token', data.access_token);
          this.api_headers = new Headers({ authorization: 'Bearer ' + token });
          this.api_options = new RequestOptions({ headers: this.api_headers});
        })
  }

  login_Google() {
    this.fire.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(res => {
          console.log(res)
          localStorage.setItem('user_google', JSON.stringify(res.user));
          let usersRef = firebase.database().ref('users')

          usersRef.once('value', snapshot =>{
            if (snapshot.hasChild(res.user.uid))
              return
          })

          usersRef.child(res.user.uid).set({
            name: res.user.displayName,
            //gr_id: null,
            //gr_books: null,
            //books: null
          })
          this.router.navigate(['dashboard']);
        })
  }

  login_Goodreads() {
    this.auth0.authorize({ connection: 'custom-goodreads' });
  }

  parseHash() {
    this.auth0.parseHash((err, authResult) => {
      console.log(authResult)
      if (authResult && authResult.idTokenPayload) {
        //window.location.hash = '';
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('access_token', authResult.accessToken);

        this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
          console.log(user)
          //localStorage.setItem('user', JSON.stringify(user));

          this.http.get('https://deadalley.auth0.com/api/v2/users/' + user.sub, this.api_options)
              .map((res:Response) => res.json())
              .subscribe(res => {
                localStorage.setItem('user_gr', JSON.stringify(res));
                localStorage.setItem('gr_access_token', res.identities[0].access_token)
              })
        })
      }
    });
  }
}
