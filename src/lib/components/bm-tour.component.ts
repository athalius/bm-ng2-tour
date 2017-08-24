/**
 * Created by gaurav.pandvia on 2/15/17.
 */

import {
    Input, Component, ElementRef, AfterViewInit, ViewEncapsulation,
    HostListener, ViewChild, HostBinding, Renderer
} from '@angular/core';
import {PlacementTypes} from "../utils/placements";
import {PositionHelper} from "../utils/position";



@Component({
    selector: 'bm-tour-content',

    template: `
    <div class="overlay"></div>
    <div class="bm-tour-content"  #content>
      <span
        #caretElm
        [hidden]="!showCaret"
        class="tooltip-caret position-{{this.placement}}">
      </span>
      <div class="tooltip-content">
      
          <ng-template
            [ngTemplateOutlet]="template"
            [ngOutletContext]="{step : context }">
          </ng-template>
       
      </div>
    </div>
  `,
    encapsulation: ViewEncapsulation.None,
    styles: [`.highlightOnOverlay {
  position: relative;
  z-index: 4999;
  box-shadow: 0 0 7px 4px rgba(245, 165, 35, 0.34);
  border-radius: 4px; }
  .showCursorPointer:before{
    font-family: FontAwesome;
    content: "\\f25a";
    position: absolute;
    color: #3d3d3d;
    font-size: 18px;
    font-weight: bolder;
    bottom: -12px;}

.overlay {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1040 !important;
  content: ""; }

.bm-tour-content {
  position: fixed;
  max-width: 400px;
  border-radius: 3px;
  z-index: 5000;
  display: block;
  font-weight: normal;
  opacity: 0;
  pointer-events: none;
  background: #fff;
  color: #3d3d3d;
  box-shadow: 0 0 4px 1px #ebeeee;
  border: 1px solid transparent;
  font-size: 13px;
  padding: 15px; }
  .bm-tour-content .title {
    font-weight: bold;
    font-size: 1.8rem;
    margin-bottom: 10px; }
  .bm-tour-content .tour-step-content {
    color: #979797;
    margin-right: 10px;
    font-size: 1.4rem; }
  .bm-tour-content span.close-tour:before {
    content: 'x';
    font-weight: bold;
    font-family: sans-serif;
    font-size: 15px;
    color: #979797;
    line-height: 1;
    top: 12px;
    right: 10px;
    cursor: pointer;
    position: absolute; }
  .bm-tour-content span.close-tour:hover::after {
    font-size: 15px;
    color: #36b7a4;
    transition: all 0.2s linear; }
  .bm-tour-content .btn-color {
    border-radius: 4px;
    background-color: #36b7a4;
    float: right;
    color: white; }
  .bm-tour-content .tooltip-caret {
    position: absolute;
    z-index: 5001;
    width: 0;
    height: 0; }
    .bm-tour-content .tooltip-caret.position-left {
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      border-left: 7px solid #fff; }
    .bm-tour-content .tooltip-caret.position-top {
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 7px solid #fff; }
    .bm-tour-content .tooltip-caret.position-right {
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      border-right: 7px solid #fff; }
    .bm-tour-content .tooltip-caret.position-bottom {
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid #fff; }
  .bm-tour-content .tooltip-caret {
    position: absolute;
    z-index: 5001;
    width: 0;
    height: 0; }
  .bm-tour-content.position-right {
    transform: translate3d(10px, 0, 0); }
  .bm-tour-content.position-left {
    transform: translate3d(-10px, 0, 0); }
  .bm-tour-content.position-top {
    transform: translate3d(0, -10px, 0); }
  .bm-tour-content.position-bottom {
    transform: translate3d(0, 10px, 0); }
  .bm-tour-content.animate {
    opacity: 1;
    transition: opacity 0.3s, transform 0.3s;
    transform: translate3d(0, 0, 0);
    pointer-events: auto; }`]
})
export class TourContentComponent implements AfterViewInit {

    @Input() host: ElementRef;
    @Input() context : any;
    @Input() showCaret: boolean = true;
    @Input() showCursor: boolean = false;
    @Input() placement: PlacementTypes;
    @Input() spacing: number;
    @Input() cssClass: string;
    @Input() title: string;
    @Input() alignment: string = "right";
    popoverClass : string = "";
    @ViewChild('caretElm') caretElm;
    @ViewChild('content') contentElm : ElementRef;

    @HostBinding('class')
    get cssClasses(): string {
        let clz = 'bm-tour-content';
        clz += ` position-${this.placement}`;
        clz += ` ${this.cssClass}`;
        this.popoverClass = clz;
        return "popover-content";
    }

    template:any = "";

    constructor(
        public element: ElementRef,
        private renderer: Renderer) {
    }

    ngAfterViewInit(): void {
        setTimeout(this.position.bind(this));
    }

    position(): void {
        // const nativeElm = this.element.nativeElement;
        const nativeElm : Element = this.contentElm.nativeElement;


        this.renderer.setElementClass(nativeElm,'position-'+this.placement,true);
        this.renderer.setElementClass(nativeElm,this.cssClass,true);
        let highlightedElems = document.querySelectorAll('.highlightOnOverlay');
        for(let i=0;i<highlightedElems.length;i++){
            highlightedElems[i].classList.remove('highlightOnOverlay');
            highlightedElems[i].classList.remove('showCursorPointer');
        }
        this.renderer.setElementClass(this.host.nativeElement,'highlightOnOverlay',true);
        if(this.showCursor){
            this.renderer.setElementClass(this.host.nativeElement,'showCursorPointer',true);
        }
        const hostDim = this.host.nativeElement.getBoundingClientRect();

        // if no dims were found, never show
        if(!this.host.nativeElement && !hostDim.height && !hostDim.width) return;

        let elmDim = nativeElm.getBoundingClientRect();
        this.checkFlip(hostDim, elmDim);
        this.positionContent(nativeElm, hostDim, elmDim);
        elmDim = nativeElm.getBoundingClientRect(); // Updated nativElm Dimenssions after above function
        if(this.showCaret) {
            this.positionCaret(hostDim, elmDim);
        }

        // animate its entry
        setTimeout(() => this.renderer.setElementClass(nativeElm, 'animate', true), 1);
    }

    /**
     *
     * @param nativeElm -- Tour Content Box
     * @param hostDim -- Host Anchor element dimensions
     * @param elmDim --  Tour Content Box dimensions
     */
    positionContent(nativeElm, hostDim, elmDim): void {
        const { top, left } = PositionHelper.positionContent(
            this.placement, elmDim, hostDim, this.spacing, this.alignment);

        // this.renderer.setElementStyle(nativeElm, 'margin-'+this.oppositePos(this.placement), `15px`);
        this.renderer.setElementStyle(nativeElm, 'top', `${top}px`);
        this.renderer.setElementStyle(nativeElm, 'left', `${left}px`);

        //Adjusting position of box, after resizing
        let newElmDim = nativeElm.getBoundingClientRect();
        if((this.placement === PlacementTypes.left && newElmDim.right > hostDim.left) ||
            this.placement === PlacementTypes.right && newElmDim.left < hostDim.right){
            this.positionContent(nativeElm,hostDim,newElmDim);
        }
    }

    positionCaret(hostDim, elmDim): void {
        const caretElm = this.caretElm.nativeElement;
        const caretDimensions = caretElm.getBoundingClientRect();
        const { top, left } = PositionHelper.positionCaret(
            this.placement, elmDim, hostDim, caretDimensions, this.alignment);

        this.renderer.setElementStyle(caretElm, 'top', `${top}px`);
        this.renderer.setElementStyle(caretElm, 'left', `${left}px`);
    }

    oppositePos(placement){
        switch(placement){
            case 'top' : return 'bottom';
            case 'bottom' : return 'top';
            case 'left' : return 'right';
            case 'right': return 'left';
            default : return 'top';
        }
    }

    checkFlip(hostDim, elmDim): void {
        this.placement = PositionHelper.determinePlacement(
            this.placement, elmDim, hostDim, this.spacing, this.alignment);
    }

    // @HostListener('window:resize')
    // @throttleable(100)
    // onWindowResize(): void {
    //   this.position();
    // }

}
