import { HttpClient, HttpParams } from '@angular/common/http'
import { parseString } from 'xml2js'
import { forkJoin } from 'rxjs/observable/forkJoin'

const parseXml = (xml: string) => {
  return new Promise((resolve) => {
    const options = { explicitRoot: false, explicitArray: false }

    parseString(xml, options, (err, res) => resolve(res))
  })
}

export const HttpGet = (http: HttpClient, url: string, params: HttpParams, cb) => {
  http.get(url, { responseType: 'text', params })
    .subscribe((xml) => parseXml(xml).then(json => cb(json)))
}

export const HttpGetAll = (http: HttpClient, requests, cb) => {
  forkJoin(requests.map((request) => http.get(request.url, { responseType: 'text', params: request.params })))
    .subscribe((results) =>
      Promise.all(results.map((result) => parseXml(result as string))).then((parsedResults) => cb(parsedResults))
    )
}
