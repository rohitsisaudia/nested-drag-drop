import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {
  @Input() children;
  @Input() containerId;
  @Input() containerList;
  @Output() dataDrop: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  dropped($event) {
    console.log('dropped in child', $event);
    this.dataDrop.emit($event);
  }
}
