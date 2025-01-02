import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopUpService } from '../create-poll-component/pop-up.service';

interface Popup {
  event: any;
  position: { top: string; left: string };
  description: string;
  title: string;
}

@Component({
  selector: 'app-pop-up-calendar',
  templateUrl: './pop-up-calendar.component.html',
  styleUrls: ['./pop-up-calendar.component.css']
})
export class PopUpCalendarComponent implements OnInit, OnDestroy {
  popups: Popup[] = [];
  eventsModified: Popup[] = [];
  dragListeners: any[] = [];

  constructor(private popupService: PopUpService) {}

  ngOnInit(): void {
    this.popupService.showPopup$.subscribe((event: any) => {
      const existingPopup = this.popups.find(popup => popup.event.id === event.id);
      const existingPopupSaved = this.eventsModified.find(popup => popup.event.id === event.id);

      if (!existingPopup) {
        const newPopup: Popup = {
          event,
          position: { top: '20px', left: '20px' },
          description: existingPopupSaved ? existingPopupSaved.description : event.extendedProps.description || '',
          title: existingPopupSaved ? existingPopupSaved.title : event.title || ''
        };
        this.popups.push(newPopup);
      } else if (existingPopupSaved) {
        existingPopup.title = existingPopupSaved.title || '';
      }
    });
  }

  saveTitle(index: number, newTitle: string): void {
    const popup = this.popups[index];
    popup.event.setProp('title', newTitle);

    const popupSaved = this.eventsModified.find(savedPopup => savedPopup.event.id === popup.event.id);
    if (popupSaved) {
      popupSaved.title = newTitle;
    } else {
      this.eventsModified.push({ ...popup });
    }
  }

  ngOnDestroy(): void {
    this.removeDragListeners();
  }

  closePopup(index: number): void {
    const popup = this.popups[index];
    const popupSaved = this.eventsModified.find(savedPopup => savedPopup.event.id === popup.event.id);
    if (popupSaved) {
      popupSaved.description = popup.description;
    } else {
      this.eventsModified.push({ ...popup });
    }
    this.popups.splice(index, 1);
    this.removeDragListeners();
  }

  startDrag(event: MouseEvent, index: number): void {
    if ((event.target as HTMLElement).tagName === 'TEXTAREA' || (event.target as HTMLElement).tagName === 'INPUT') {
      return;
    }

    const popup = this.popups[index];
    popup.event.isDragging = true;
    popup.event.offsetX = event.clientX - parseInt(popup.position.left, 10);
    popup.event.offsetY = event.clientY - parseInt(popup.position.top, 10);

    const mouseMoveListener = (e: MouseEvent) => this.dragPopup(e, index);
    const mouseUpListener = () => this.stopDrag(index);

    this.dragListeners.push(mouseMoveListener, mouseUpListener);

    document.addEventListener('mousemove', mouseMoveListener);
    document.addEventListener('mouseup', mouseUpListener, { once: true });

    event.preventDefault();
  }

  dragPopup(event: MouseEvent, index: number): void {
    const popup = this.popups[index];
    if (popup.event.isDragging) {
      popup.position.left = `${event.clientX - popup.event.offsetX}px`;
      popup.position.top = `${event.clientY - popup.event.offsetY}px`;
    }
  }

  stopDrag(index: number): void {
    const popup = this.popups[index];
    popup.event.isDragging = false;
    this.removeDragListeners();
  }

  removeDragListeners(): void {
    this.dragListeners.forEach(listener => {
      document.removeEventListener('mousemove', listener);
      document.removeEventListener('mouseup', listener);
    });
    this.dragListeners = [];
  }

  saveDescription(index: number, newDescription: string): void {
    const popup = this.popups[index];
    const popupSaved = this.eventsModified.find(savedPopup => savedPopup.event.id === popup.event.id);
    popup.description = newDescription;
    popup.event.description = newDescription;

    if (popupSaved) {
      popupSaved.description = newDescription;
    } else {
      this.eventsModified.push({ ...popup });
    }
  }
}
