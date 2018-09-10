import { PublicationLink } from '@evidentpoint/r2-shared-js';
import { IFrameLoader } from '../../iframe-loader';
import { CancellationToken } from '../types';
import { IContentView } from './content-view';

type IframeLoadedCallback = (success: boolean) => void;

export class R2ContentView implements IContentView {
  protected host: HTMLElement;

  protected iframeLoader: IFrameLoader;

  protected iframeContainer: HTMLElement;
  protected iframe: HTMLIFrameElement;

  protected iframeLoadedCallbacks: IframeLoadedCallback[] = [];

  protected spineItem: PublicationLink;
  protected spineItemIndex: number;

  public constructor(loader: IFrameLoader) {
    this.iframeLoader = loader;
  }

  public render(): void {
    throw new Error('Method not implemented.');
  }

  public loadSpineItem(spineItem: PublicationLink, spineItemIndex: number,
                       token?: CancellationToken | undefined): Promise<void> {
    this.spineItem = spineItem;
    this.spineItemIndex = spineItemIndex;

    this.render();

    this.hideIframe();

    const onIframeContentLoaded = (success: boolean) => {
      this.onIframeLoaded(success);
    };

    this.iframeLoader.loadIframe(this.iframe, spineItem.Href, onIframeContentLoaded,
                                 {}, spineItem.TypeLink);

    return this.iframeLoadedPromise();
  }

  public spineItemLoadedPromise(token?: CancellationToken | undefined): Promise<void> {
    return this.iframeLoadedPromise();
  }

  public unloadSpineItem(): void {
    this.host.removeChild(this.iframeContainer);
  }

  public attachToHost(host: HTMLElement): void {
    this.host = host;
  }

  public setViewSettings(viewSetting: object): void {
    throw new Error('Method not implemented.');
  }

  public scale(scale: number): void {
    throw new Error('Method not implemented.');
  }

  public element(): HTMLElement {
    return this.iframeContainer;
  }

  public metaWidth(): number {
    throw new Error('Method not implemented.');
  }

  public metaHeight(): number {
    throw new Error('Method not implemented.');
  }

  public calculatedHeight(): number {
    throw new Error('Method not implemented.');
  }

  public spineItemPageCount(): number {
    return 1;
  }

  public getPageIndexOffsetFromCfi(cfi: string): number {
    throw new Error('Method not implemented.');
  }

  public getPageIndexOffsetFromElementId(elementId: string): number {
    throw new Error('Method not implemented.');
  }

  public getCfi(offsetMain: number, offset2nd: number): string {
    throw new Error('Method not implemented.');
  }

  public onResize(): void {
    throw new Error('Method not implemented.');
  }

  protected setupIframe(): void {
    this.iframeContainer.style.transform = 'none';
    this.iframe.width = '100%';
    this.iframe.height = '100%';
  }

  protected hideIframe(): void {
    this.iframe.style.visibility = 'hidden';
  }

  protected showIFrame(): void {
    this.iframe.style.visibility = 'visible';
    this.iframe.style.left = '0px';
    this.iframe.style.top = '0px';
  }

  protected iframeLoadedPromise(token?: CancellationToken): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      const listener = (success: boolean) => {
        resolve();
      };

      this.iframeLoadedCallbacks.push(listener);
    });
  }

  protected onIframeLoaded(success: boolean): void {
    for (const callback of this.iframeLoadedCallbacks) {
      callback(success);
    }
    this.iframeLoadedCallbacks = [];
  }
}
