import { HttpClient, HttpParams } from '@angular/common/http'
import { parseString } from 'xml2js'
import { forkJoin } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

const parseXml = (xml: string) => {
  return new Promise(resolve => {
    const options = { explicitRoot: false, explicitArray: false }

    parseString(xml, options, (err, res) => resolve(res))
  })
}

export const HttpGet = (http: HttpClient, url: string, params: HttpParams) => {
  return http
    .get(url, { responseType: 'text', params })
    .pipe(mergeMap(xml => parseXml(xml))) as any
}

export const HttpGetAll = (http: HttpClient, requests) => {
  return forkJoin(requests.map(request =>
    HttpGet(http, request.url, request.params)
  ) as any[])
}
