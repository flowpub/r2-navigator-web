import { Publication } from '../streamer/publication';
import { PackageDocument } from '../streamer/readium-share-js-impl/package-document';
import { IFrameLoader } from './iframe-loader';
import { LayoutView } from './views/layout-view';
import { Viewport } from './views/viewport';

export class Rendition {
  public viewport: Viewport;

  private pub: Publication;

  private pageWidth: number;
  private pageHeight: number;

  constructor(pub: Publication, viewport: HTMLElement) {
    this.pub = pub;
    this.viewport = new Viewport(viewport);
  }

  public setPageSize(pageWidth: number, pageHeight: number): void {
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
  }

  public getPageWidth(): number {
    return this.pageWidth;
  }

  public getPublication(): Publication {
    return this.pub;
  }

  public render(): Promise<void> {
    const bookView = new LayoutView(this.pub);
    bookView.setPageSize(this.pageWidth, this.pageHeight);

    this.viewport.setView(bookView);

    return Promise.resolve();
  }
}
