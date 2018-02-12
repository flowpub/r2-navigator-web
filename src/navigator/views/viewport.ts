import { LayoutView, PaginationInfo } from './layout-view';
import { View } from './view';

export class Viewport {
  private bookView: LayoutView;

  private viewportSize: number;

  private viewOffset: number;

  private startPos?: PaginationInfo;
  private endPos?: PaginationInfo;

  private root: HTMLElement;

  private hasPendingAction: boolean = false;

  private scrollEnabled: boolean = false;

  constructor(root: HTMLElement) {
    this.root = root;

    this.nextScreen = this.nextScreen.bind(this);
    this.prevScreen = this.prevScreen.bind(this);
  }

  public setView(v: LayoutView): void {
    this.bookView = v;
    this.bookView.attatchToHost(this.root);
  }

  public enableScroll(e: boolean): void {
    this.scrollEnabled = e;
    if (this.scrollEnabled) {
      this.initScrolling();
    }
  }

  public getViewportSize(): number {
    return this.viewportSize;
  }

  public setViewportSize(size: number): void {
    this.viewportSize = size;
  }

  public getStartPosition(): PaginationInfo | undefined {
    return this.startPos;
  }

  public getEndPosition(): PaginationInfo | undefined {
    return this.endPos;
  }

  public async renderAtOffset(position: number): Promise<void> {
    this.viewOffset = position;
    this.render();

    await this.bookView.ensureConentLoadedAtRange(position, position + this.viewportSize);
  }

  public async renderAtSpineItem(spineItemIndex: number): Promise<void> {
    await this.bookView.ensureContentLoadedAtSpineItemRange(spineItemIndex, spineItemIndex);
    this.viewOffset = 0;

    this.render();
  }

  public async nextScreen(): Promise<void> {
    this.hasPendingAction = true;
    await this.renderAtOffset(this.viewOffset + this.viewportSize);
    this.hasPendingAction = false;
  }

  public async prevScreen(): Promise<void> {
    this.hasPendingAction = true;
    await this.renderAtOffset(this.viewOffset - this.viewportSize);
    this.hasPendingAction = false;
  }

  private initScrolling(): void {
    this.root.style.overflowX = 'scroll';
    this.root.style.overflowY = 'hidden';

    this.root.addEventListener('scroll', async (e) => {
      // console.log(this.root.scrollLeft);
      this.viewOffset = this.root.scrollLeft;
      if (this.hasPendingAction) {
        return;
      }

      if (this.viewOffset + this.viewportSize >= this.bookView.loadedRangeLength()) {
        await this.nextScreen();
      } else if (this.viewOffset <= 0 && this.bookView.hasMoreBeforeStart()) {
        await this.prevScreen();
      }
    });
  }

  private updatePositions(): void {
    const startInfo = this.bookView.getPaginationInfoAtOffset(this.viewOffset);
    if (startInfo.length > 0) {
      this.startPos = startInfo[startInfo.length - 1];
    } else {
      this.startPos = undefined;
    }

    const endInfo = this.bookView.getPaginationInfoAtOffset(this.viewOffset + this.viewportSize);
    if (endInfo.length > 0) {
      this.endPos = endInfo[0];
    } else {
      this.endPos = undefined;
    }
  }

  private render(): void {
    if (this.scrollEnabled) {
      this.root.scrollLeft = this.viewOffset;
    } else {
      const containerElement = this.bookView.containerElement();
      containerElement.style.transform = `translateX(${-this.viewOffset}px)`;
    }

    this.updatePositions();
  }
}
