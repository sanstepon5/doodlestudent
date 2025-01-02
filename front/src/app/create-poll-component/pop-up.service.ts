// event-popup.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {EventImpl} from '@fullcalendar/core/internal';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  private showPopupSource = new Subject<any>();
  showPopup$ = this.showPopupSource.asObservable();

  showPopup(event: EventImpl): void {
    console.log('Showing popup with event:', event);
    this.showPopupSource.next(event);
  }
}
