import { Component, AfterContentInit, ContentChildren, QueryList, ViewChild } from '@angular/core';
import { ITab } from './tab/tab.interface';
import { TabComponent } from './tab/tab.component';
import { NavigatorService, WindowService } from '../../utils/services/index';
import { Browser } from '../../utils/util/browser/browser';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @ViewChild('tabContent', { static: false }) tabContent;

  constructor(private deviceDetector: NavigatorService, private windowsService: WindowService) {
  }

  ngAfterContentInit() {
    this.tabs.reset(this.tabs.filter(x => !x.isHidden));
    setTimeout(() => {
      this.selectTab(this.tabs.find(x => x.isActive) ? this.tabs.find(x => x.isActive) : this.tabs.first, 0);
    }, 500);
  }

  selectTab(tab: ITab, indexSelect: number) {
    if (!tab.disabled) {
      this.tabs.forEach(aux => aux.isActive = false);
      tab.isActive = true;
    }
    const browser = new Browser(this.windowsService);
    // if (browser.getBrowser() === 'ie') {
    // }
    this.scrollTabs(indexSelect);
  }

  scrollTabs(indexSelect: number) {
    const children = this.tabContent.nativeElement.children[indexSelect];
    if (indexSelect > 0 && children && children.offsetLeft) {
      this.tabContent.nativeElement.scrollTo(children.offsetLeft * 0.75, children.scrollWidth);
    } else {
      this.tabContent.nativeElement.scrollTo(0, 0);
    }
  }
}
