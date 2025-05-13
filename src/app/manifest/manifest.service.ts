import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManifestService {
  private http = inject(HttpClient);

  getManifest() {
    return this.http.get('/assets/manifest.json');
  }
}
