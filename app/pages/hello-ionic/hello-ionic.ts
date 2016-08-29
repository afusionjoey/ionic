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
  private data = [];
  private before;
  private error = false;
  // private isBusy: boolean;

  getData(before?: number) {
    var tumblrOptions = new URLSearchParams();
    tumblrOptions.set("api_key", this.api_key);
    tumblrOptions.set("tag", this.tag);
    if (typeof before !== 'undefined') {
      tumblrOptions.set("before", this.before);
    }

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

  load(before?: number) {
    this.getData(before).subscribe(data => {
      this.data = this.data.concat(data);
      this.before = data.slice(-1)[0].timestamp;
      this.error = false;
    },
    err => {
      console.log(err);
      this.error = true;
      this.before = this.before + 1;
      this.load(this.before);
    });
  }

  ngOnInit() {
      this.load();
  }


  doInfinite(infiniteScroll) {
    setTimeout(() => {
      console.log(this.error);
      this.load(this.before);
      console.log(this.error);

      infiniteScroll.complete();
    }, 2000);
  }
}