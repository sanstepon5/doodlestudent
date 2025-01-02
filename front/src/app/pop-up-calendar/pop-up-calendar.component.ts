import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopUpService } from '../create-poll-component/pop-up.service';

interface Popup {
  event: any; // The event data to display
  position: { top: string; left: string }; // Position of the popup
  description: string; // The editable description
}

@Component({
  selector: 'app-pop-up-calendar',
  templateUrl: './pop-up-calendar.component.html',
  styleUrls: ['./pop-up-calendar.component.css']
})
export class PopUpCalendarComponent implements OnInit, OnDestroy {
  popups: Popup[] = []; // Array to store multiple popups
  eventsModified: Popup[] = []; // Array to store modified event descriptions
  dragListeners: any[] = []; // To store drag event listeners

  constructor(private popupService: PopUpService) {}

  ngOnInit(): void {
    this.popupService.showPopup$.subscribe((event: any) => {
      // Check if the event is already open in a popup
      const existingPopup = this.popups.find((popup) => popup.event.id === event.id);
      const existingPopupSaved = this.eventsModified.find((popup) => popup.event.id === event.id);

      if (!existingPopup) {
        // If event is not already open, create a new popup
        const newPopup: Popup = {
          event,
          position: { top: '20px', left: '20px' }, // Default position
          description: existingPopupSaved ? existingPopupSaved.description : event.extendedProps.description || '' // If it's saved, use the saved description
        };
        this.popups.push(newPopup);
      } else if (existingPopupSaved) {
        // Ensure the description is updated when reopening
        existingPopup.description = existingPopupSaved.description || '';
      }
    });
  }

  ngOnDestroy(): void {
    // Remove all drag event listeners when the component is destroyed
    this.removeDragListeners();
  }

  closePopup(index: number): void {
    // Get the modified event data and update the eventsModified array
    const popup = this.popups[index];
    const popupSaved = this.eventsModified.find((savedPopup) => savedPopup.event.id === popup.event.id);

    if (popupSaved) {
      popupSaved.description = popup.description; // Save modified description when popup is closed
    } else {
      this.eventsModified.push({ ...popup }); // Save new event data if it's a new modification
    }

    // Remove the popup from the array
    this.popups.splice(index, 1);
    this.removeDragListeners(); // Remove listeners when closing the popup
  }

  startDrag(event: MouseEvent, index: number): void {
    // Prevent dragging if the user clicked inside the textarea
    if ((event.target as HTMLElement).tagName === 'TEXTAREA') {
      return;
    }

    const popup = this.popups[index];
    popup.event.isDragging = true;
    popup.event.offsetX = event.clientX - parseInt(popup.position.left, 10);
    popup.event.offsetY = event.clientY - parseInt(popup.position.top, 10);

    // Add listeners for mousemove and mouseup
    const mouseMoveListener = (e: MouseEvent) => this.dragPopup(e, index);
    const mouseUpListener = () => this.stopDrag(index);

    // Store listeners for later removal
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

    // Clean up drag listeners
    this.removeDragListeners();
  }

  removeDragListeners(): void {
    // Remove all drag listeners
    this.dragListeners.forEach(listener => {
      document.removeEventListener('mousemove', listener);
      document.removeEventListener('mouseup', listener);
    });
    this.dragListeners = []; // Reset the listeners
  }

  saveDescription(index: number, newDescription: string): void {
    const popup = this.popups[index];
    const popupSaved = this.eventsModified.find((savedPopup) => savedPopup.event.id === popup.event.id);

    // Update description in the popup
    popup.description = newDescription;
    popup.event.description = newDescription; // Update the event's description if needed

    if (popupSaved) {
      popupSaved.description = newDescription; // Save the new description in the eventsModified array
    } else {
      // If it's a new modification, save it in eventsModified
      this.eventsModified.push({ ...popup });
    }

    console.log('Saved description:', newDescription); // Debugging log
  }
}
