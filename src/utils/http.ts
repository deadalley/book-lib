import { parseString } from 'xml2js'
import { HttpClient, HttpParams } from '@angular/common/http'

export const HttpGet = (http: HttpClient, url: string, params: HttpParams, cb) => {
  http.get(url, { responseType: 'text', params })
    .subscribe((xml) => {
      new Promise((resolve) => {
        const options = { explicitRoot: false, explicitArray: false }

        parseString(xml, options, (err, res) => resolve(res))

      }).then(json => cb(json))
    })
}
