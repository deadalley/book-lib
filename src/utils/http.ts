import { parseString, parseNumbers } from 'xml2js'
import { Http, Response } from '@angular/http'

export const HttpGet = (http: Http, url: string, cb) => {
  http.get(url)
    .map((res: Response) => res.text())
    .subscribe((xml) => {
      new Promise((resolve) => {
        const options = { explicitRoot: false, explicitArray: false }

        parseString(xml, options, (err, res) => resolve(res))

      }).then(json => cb(json))
    })
}
