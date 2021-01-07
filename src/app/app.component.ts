import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'drag-drop';
  dataArr=['list1', 'list2', 'list3', 'list4', {children: ['child1', 'child2']}, 'list 5', {children: ['child3']},'list6'];
  mappedArr: Array<any> = [];
  containerList: Array<string> = [];
  groupMoving = false;

  constructor() {}

  ngOnInit() {
    this.createMappedArr();
  }

  createMappedArr() {
    let j = 0;
    for(let i=0;i < this.dataArr.length; i++) {
      if (typeof(this.dataArr[i]) === 'string') {
        if (this.mappedArr[j]) {
          this.mappedArr[j].push(this.dataArr[i]);
        } else {
          this.containerList.push('primary-' + j.toString());
          this.mappedArr[j] = [this.dataArr[i]];
        }
      } else {
        j++;
        this.containerList.push('nested-'+j.toString());
        this.mappedArr[j]=[this.dataArr[i]];
        j++;
      }
    }
    console.log('mapped', this.mappedArr);
    console.log(this.containerList);
  }


  dropped($event) {
    console.log('dropped', $event);
    const currentIndex = $event.currentIndex;
    const previousIndex = $event.previousIndex;
    const currentContainer = $event.container.id.split('-');
    const previousContainer = $event.previousContainer.id.split('-');
    const data = $event.item.data;
    if (data.children && currentContainer[0]==='nested') {
      // do nothing if a group is being dragged into another group;
      return;
    }

    // handle drop from one primary to another primary
    if (previousContainer[0] === 'primary' && currentContainer[0] === 'primary') {
      this.mappedArr[previousContainer[1]].splice(previousIndex, 1);
      this.mappedArr[currentContainer[1]].splice(currentIndex, 0, data).join();
    } else if (previousContainer[0] === 'nested' && currentContainer[0] === 'primary') {
      // source container is nested and destination is primary
      this.mappedArr[previousContainer[1]][0].children.splice(previousIndex, 1);
      this.mappedArr[currentContainer[1]].splice(currentIndex, 0, data).join();
    } else if (previousContainer[0] === 'primary' && currentContainer[0] === 'nested') {
      // source container is primary and destination is nested
      this.mappedArr[previousContainer[1]].splice(previousIndex, 1);
      this.mappedArr[currentContainer[1]][0].children.splice(currentIndex, 0, data).join();
    } else {
      // both source and destination containers are nested
      this.mappedArr[previousContainer[1]][0].children.splice(previousIndex, 1);
      this.mappedArr[currentContainer[1]][0].children.splice(currentIndex, 0, data).join();
    }
    
    console.log('final data', [].concat.apply([], this.mappedArr))
  }

  newContainerDrag($event) {
    console.log('new container drag,', $event);
  }

  exitedContainer($event) {
    console.log('exited', $event);
    const data = $event.item.data;
    if (data.children) {
      console.log('group moving');
      this.groupMoving = true;
    } else {
      this.groupMoving = false;
    }
  }
}
