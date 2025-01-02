import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EventApi } from '@fullcalendar/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {
  private showPopupSubject = new Subject<EventApi>(); // Subject for showing popups
  showPopup$ = this.showPopupSubject.asObservable(); // Observable for showPopup

  // Method to emit the EventApi for popups
  showPopup(eventApi: EventApi): void {
    this.showPopupSubject.next(eventApi); // Emit the eventApi to show popup
  }
}
