/** client.js is a page-lifetime browser module imported only for its side
 *  effects: it mounts the LAN table into the page. It exports nothing. The
 *  extension LAN view configures it through ./embedding BEFORE importing it;
 *  see embedding.ts for why setters exported from here were too late. */
export {}
