import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
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

  constructor() {}

  ngOnInit() {
    this.createMappedArr(this.dataArr);
  }

  createMappedArr(data) {
    this.mappedArr=[];
    this.containerList=[];
    let j = 0;
    for(let i=0;i < data.length; i++) {
      if (typeof(data[i]) === 'string') {
        if (this.mappedArr[j]) {
          this.mappedArr[j].push(data[i]);
        } else {
          this.mappedArr[j] = [data[i]];
        }
      } else {
        j++;
        this.mappedArr[j]=[data[i]];
        j++;
      }
    }
    console.log('mapped', this.mappedArr);
    // remove empty elements
    this.mappedArr = _.filter(this.mappedArr, function(a) { return !_.isEmpty(a)});
    console.log('mapped', this.mappedArr);
    
    for (let i = 0; i < this.mappedArr.length; i++) {
      if (this.mappedArr[i][0].children) {
          this.containerList.push('nested-' + i.toString());
      } else {
          this.containerList.push('primary-'+ i.toString());
      }
    }
    console.log('container IDs', this.containerList);
  }


  dropped($event) {
    console.log('dropped', $event);
    const currentIndex = $event.currentIndex;
    const previousIndex = $event.previousIndex;
    const currentContainer = $event.container.id.split('-');
    const previousContainer = $event.previousContainer.id.split('-');
    const data = $event.item.data;
    console.log('data', data)
    if (data.children && currentContainer[0]==='nested') {
      // do nothing if a group is being dragged into another group;
      return;
    }

    console.log('previousContainer', previousContainer);
    console.log('currentContainer', currentContainer);


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
    let finalData = [].concat.apply([], this.mappedArr);
    finalData = _.filter(finalData, function(a) { return !_.isUndefined(a)});
    console.log('final data', finalData)
    this.createMappedArr(finalData);
  }
}
