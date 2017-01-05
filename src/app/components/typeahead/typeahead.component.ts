import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef,
  Input,
  TemplateRef, HostListener
} from '@angular/core';

import { Jsonp, URLSearchParams, RequestOptionsArgs } from '@angular/http';
import { Subscription, Observable } from 'rxjs';
import { Key } from '../../enums/key.enum';
import { TypeAheadService } from '../../typeahead.service';


@Component({
  selector: '[typeahead]',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.css']
})
export class TypeAheadComponent implements OnInit, OnDestroy {
  @Output() typeaheadSelected = new EventEmitter<string>();
  @Input() typeaheadItemTpl: TemplateRef<any>;

  private showSuggestions: boolean = false;
  private results: string[];
  private suggestionIndex: number = 0;
  private subscriptions: Subscription[];
  private activeResult: string;

  @ViewChild('suggestionsTplRef') suggestionsTplRef;

  @HostListener('keydown', ['$event'])
  handleEsc(event: KeyboardEvent) {
      if(event.keyCode === Key.Escape) {
        this.hideSuggestions();
        event.preventDefault();
      }
  }

  constructor(private element: ElementRef,
              private viewContainer: ViewContainerRef,
              private jsonp: Jsonp,
              private typeAheadService: TypeAheadService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscriptions = [
      this.filterEnterEvent(),
      this.listenAndSuggest(),
      this.navigateWithArrows()
    ];
    this.renderTemplate();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  renderTemplate() {
    this.viewContainer.createEmbeddedView(this.suggestionsTplRef);
    this.cdr.markForCheck();
  }

  filterEnterEvent() {
    return Observable.fromEvent(this.element.nativeElement, 'keydown')
      .filter((e: KeyboardEvent) => e.keyCode === Key.Enter)
      .subscribe((event: Event) => {
        event.preventDefault();
        this.handleSelectSuggestion(this.activeResult);
      });
  }

  listenAndSuggest() {
    return Observable.fromEvent(this.element.nativeElement, 'keyup')
      .filter(this.validateKeyCode)
      .map((e: any) => e.target.value)
      .debounceTime(250)
      .concat()
      .distinctUntilChanged()
      .filter((query: string) => query.length > 0)
      .switchMap((query: string) => this.suggest(query))
      .subscribe((results: string[]) => {
        this.results = results;
        this.showSuggestions = true;
        this.cdr.markForCheck();
      });
  }

  navigateWithArrows() {
    return Observable.fromEvent(this.element.nativeElement, 'keydown')
      .filter((e: any) => e.keycode === Key.ArrowDown || e.keycode === Key.ArrowUp)
      .map((e: any) => e.keyCode)
      .subscribe((keyCode: number) => {
        let step = keyCode === Key.ArrowDown ? 1 : -1;
        const bottomLimit = 0;
        const topLimit = 9;
        this.suggestionIndex += step;
        if (this.suggestionIndex === topLimit + 1) {
          this.suggestionIndex = bottomLimit;
        }
        if (this.suggestionIndex === bottomLimit - 1) {
          this.suggestionIndex = topLimit;
        }
        this.showSuggestions = true;
        this.cdr.markForCheck();
      });
  }

  markIsActive(index: number, result: string) {
    const isActive = index === this.suggestionIndex;
    if (isActive) {
      this.activeResult = result;
    }
    return isActive;
  }

  handleSelectSuggestion(suggestion: string) {
    this.hideSuggestions();
    this.typeaheadSelected.emit(suggestion);
  }

  suggest(query: string) {
    return this.typeAheadService.getSuggestions(query);
  }

  validateKeyCode(event: KeyboardEvent) {
    return event.keyCode !== Key.Tab
      && event.keyCode !== Key.Shift
      && event.keyCode !== Key.ArrowLeft
      && event.keyCode !== Key.ArrowUp
      && event.keyCode !== Key.ArrowRight
      && event.keyCode !== Key.ArrowDown;
  }

  hideSuggestions() {
    this.showSuggestions = false;
  }

  hasItemTemplate() {
    return this.typeaheadItemTpl !== undefined;
  }
}
