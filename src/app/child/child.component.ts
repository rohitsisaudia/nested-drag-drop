import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent {
  @Input() children;
  @Input() containerId;
  @Input() containerList;
  @Output() dataDrop: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  // emitting drop event to parent to handle in the same method
  dropped($event) {
    console.log('dropped in child', $event);
    this.dataDrop.emit($event);
  }
}
