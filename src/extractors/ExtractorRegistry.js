import { WikipediaExtractor } from "./WikipediaExtractor.js";
import { GenericExtractor } from "./GenericExtractor.js";

export class ExtractorRegistry {
  constructor() {
    this.mappings = [
      { pattern: "*.wikipedia.org", classRef: WikipediaExtractor },
      { pattern: "wikipedia.org", classRef: WikipediaExtractor }
    ];
  }

  resolve(url) {
    if (!url || typeof url !== "string") {
      return new GenericExtractor();
    }

    try {
      let parsedUrl;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        parsedUrl = new URL("https://" + url);
      } else {
        parsedUrl = new URL(url);
      }
      const hostname = parsedUrl.hostname.toLowerCase();

      for (const mapping of this.mappings) {
        if (this._matchHostname(hostname, mapping.pattern)) {
          return new mapping.classRef();
        }
      }
    } catch (e) {
      // Fallback if URL is malformed
    }

    return new GenericExtractor();
  }

  _matchHostname(hostname, pattern) {
    const escaped = pattern.toLowerCase()
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");
    const regex = new RegExp("^" + escaped + "$");
    return regex.test(hostname);
  }
}
