import { ReadingSystem } from '../../src/navigator/reading-system';
import { Rendition } from '../../src/navigator/rendition';
import { Publication } from '../../src/streamer';

export async function openRendition(pubUrl: string): Promise<Rendition> {
  const rs = new ReadingSystem();

  const viewport = document.getElementById('viewport');
  if (viewport) {
    rs.initRenderer(viewport);
  }

  const publication = await Publication.ParseFromURL(pubUrl, pubUrl);

  return rs.openRendition(publication);
}
