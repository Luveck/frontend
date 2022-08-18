import { Component, OnInit, Input } from '@angular/core';

// Breadcrumb component interface
export interface Breadcrumb {
  type?: string;
  alignment?: string;
  links?: Array<{
    name: string;
    isLink: boolean;
    link?: string;
  }>;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() breadcrumb: Breadcrumb |any;

  constructor() {}

  ngOnInit() {
    this.breadcrumb = this.breadcrumb;
  }
}
