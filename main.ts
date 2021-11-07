import { getEnvOrThrow } from './infra/env-utils';
import { EventsProvider } from './domain/ports/in/events-provider';
import { Storage } from './domain/ports/out/storage';
import { SpreadSheetsAdapter } from './spread-sheets';
import { SaveOutcomeUseCase } from './domain/use-cases/save-outcome';
import { UseCase } from './domain/use-cases/use-case';
import { TelegramEventsProvider } from './tg';
import { ArchivateWeekDataUseCase } from './domain/use-cases/archivate-week-data';

class App {
  _events: EventsProvider;
  _storage: Storage;
  _useCases: typeof UseCase[];

  constructor(config: {
    in: EventsProvider;
    out: Storage;
    useCases: typeof UseCase[];
  }) {
    this._events = config.in;
    this._storage = config.out;
    this._useCases = [...config.useCases];
  }

  run() {
    const useCases = this._useCases.map(
      (UseCaseClass) => new UseCaseClass(this._events, this._storage)
    );
    useCases.forEach((useCase) => useCase.use());
  }
}

const SPREADSHEET_ID = getEnvOrThrow('SPREADSHEET_ID');
const TG_TOKEN = getEnvOrThrow('TG_TOKEN');

const spreadsheetAdapter = new SpreadSheetsAdapter(SPREADSHEET_ID);
spreadsheetAdapter.init().then(() => {
  const app = new App({
    in: new TelegramEventsProvider(TG_TOKEN),
    out: spreadsheetAdapter,
    useCases: [SaveOutcomeUseCase, ArchivateWeekDataUseCase],
  });
  app.run();
});
