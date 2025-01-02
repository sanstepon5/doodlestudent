import { Component, OnInit } from '@angular/core';
import { PopUpService } from '../create-poll-component/pop-up.service';

@Component({
  selector: 'app-pop-up-calendar',
  templateUrl: './pop-up-calendar.component.html',
  styleUrls: ['./pop-up-calendar.component.css']
})
export class PopUpCalendarComponent implements OnInit {
  event: any = null; // The current event to display
  isVisible = false; // Popup visibility state
  isDragging = false; // To track if the popup is being dragged
  offsetX = 0; // Offset for mouse position X
  offsetY = 0; // Offset for mouse position Y
  popupPosition = { top: '20px', left: '20px' }; // Default position

  constructor(private popupService: PopUpService) {}

  ngOnInit(): void {
    // Subscribe to popup events
    this.popupService.showPopup$.subscribe((event: any) => {
      this.event = event; // Store the event details
      this.isVisible = true; // Show the popup
    });
  }

  togglePopup(): void {
    this.isVisible = !this.isVisible; // Toggle the visibility of the popup
    if (!this.isVisible) {
      this.event = null; // Reset event data if closing
    }
  }

  closePopup(): void {
    this.isVisible = false; // Hide the popup
    this.event = null; // Reset event data if needed
  }

  startDrag(event: MouseEvent): void {
    this.isDragging = true;
    this.offsetX = event.clientX - parseInt(this.popupPosition.left, 10);
    this.offsetY = event.clientY - parseInt(this.popupPosition.top, 10);
    event.preventDefault(); // Prevent default mouse events to avoid page scroll
  }

  dragPopup(event: MouseEvent): void {
    if (this.isDragging) {
      this.popupPosition.left = `${event.clientX - this.offsetX}px`;
      this.popupPosition.top = `${event.clientY - this.offsetY}px`;
    }
  }

  stopDrag(): void {
    this.isDragging = false; // Stop dragging
  }
}
