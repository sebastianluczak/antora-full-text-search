import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { glob } from 'glob';
import { MeiliSearch } from 'meilisearch';

const client = new MeiliSearch({
  host: 'http://127.0.0.1:7700',
  apiKey: 'masterKey',
});

const sanitizeHtmlToPlainText = (html: string): string => {
  html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
  html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
  html = html.replace(/<\/div>/gi, '\n');
  html = html.replace(/<\/li>/gi, '\n');
  html = html.replace(/<li>/gi, '  *  ');
  html = html.replace(/<\/ul>/gi, '\n');
  html = html.replace(/<\/p>/gi, '\n');
  html = html.replace(/<br\s*[\/]?>/gi, '\n');
  html = html.replace(/<[^>]+>/gi, '');

  return html;
};

type InfoFile = {
  title: string;
  version: string;
};

type BuiltDocument = {
  id: number;
  mainTitle: string;
  mainVersion: string;
  path: string;
  content: string;
};

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private index = client.index('documents_search_index');

  async buildDocuments() {
    const paths = await glob('../../../antora_build/{**/*.html,**/info.json}');
    const builtDocuments: BuiltDocument[] = [];

    const infoJsonPaths = paths.filter((path) => path.endsWith('info.json'));

    // info.json file represents an antora artifact we want to index.
    // `paths` contains all HTML documents in this artifact we want to index.
    // contents of `info.json` helps us match document to particular antora artifact
    infoJsonPaths.forEach((infoJsonPath) => {
      const contentOfInfoJson = readFileSync(infoJsonPath);
      const parsedInfoJson = JSON.parse(
        contentOfInfoJson.toString(),
      ) as InfoFile;

      const pathsToLookFor = infoJsonPath.replace('info.json', '');
      const htmlDocumentsForThisArtifact = paths.filter(
        (path) =>
          path.startsWith(pathsToLookFor) && !path.endsWith('info.json'),
      );
      console.log(htmlDocumentsForThisArtifact);

      htmlDocumentsForThisArtifact.forEach((path) => {
        const content = readFileSync(path);
        this.logger.debug(
          `Registering ${parsedInfoJson.title} search partial: ${path}`,
        );
        builtDocuments.push({
          id: Math.floor(Math.random() * 10000),
          mainTitle: parsedInfoJson.title,
          mainVersion: parsedInfoJson.version,
          path: path,
          content: sanitizeHtmlToPlainText(content.toString()),
        });
      });
    });

    return builtDocuments;
  }

  async addDocuments() {
    this.logger.log('Adding documents');
    await this.index.addDocuments(await this.buildDocuments());
  }

  async searchFor(phrase: string) {
    return await this.index.search(phrase, {
      attributesToHighlight: ['*'],
    });
  }
}
