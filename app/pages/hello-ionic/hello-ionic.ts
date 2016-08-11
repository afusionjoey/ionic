import {Component} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";

@Component({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
})
export class HelloIonicPage {

  constructor(private http: Http) { }

  private api_key = "fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4";
  private tag = "lol";
  private tumblr_getTagged = "https://api.tumblr.com/v2/tagged";
  private data;
  // private isBusy: boolean;

  getInfo() {
    var tumblrOptions = new URLSearchParams();
    tumblrOptions.set("api_key", this.api_key);
    tumblrOptions.set("tag", this.tag);

    return this.http.get(this.tumblr_getTagged, {search: tumblrOptions})
    .map(data => data.json())
    .map(json => json.response)
    .map(items => {
      return items
      .filter(item => item.photos && item.photos.length > 0)
      .map(item => {
        return {
          imageUrl: item.photos[0].alt_sizes[2].url,
          blogName: item.blog_name,
          timestamp: item.timestamp
        }
      });
    });
  }

  ngOnInit() {
    this.getInfo().subscribe(data => {
      this.data = data;
    });
  }
}