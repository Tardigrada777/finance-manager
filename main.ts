import { config } from 'dotenv';
import { ConsoleEventsProvider } from './cli';
import { EventsProvider } from './domain/ports/in/events-provider';
import { Storage } from './domain/ports/out/storage';
// import { SpreadSheetsAdapter } from './spread-sheets';
import { SaveTransactionUseCase } from './domain/ports/in/use-cases/save-transaction';
import { UseCase } from './domain/ports/in/use-cases/use-case';
import { SaveTransactionUseCase2 } from './domain/ports/in/use-cases/save-transaction.2';
import { FileStorageAdapter } from './file-storage';
import { TelegramEventsProvider } from './tg';

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

const SPREADSHEET_ID = config().parsed?.SPREADSHEET_ID;
const TG_TOKEN = config().parsed?.TG_TOKEN;

// const spreadsheetAdapter = new SpreadSheetsAdapter(SPREADSHEET_ID || '');

// spreadsheetAdapter.init().then(() => {

// });

const app = new App({
  in: new TelegramEventsProvider(TG_TOKEN || ''),
  out: new FileStorageAdapter(),
  useCases: [SaveTransactionUseCase],
});
app.run();

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// ..

// let storage: Storage = new SpreadSheetsAdapter();

// const saveToFile = async () => {
//   const transactonService = new TransactionService(storage);
//   const saveTransactionCommand = new SaveTransactionCommand(
//     '1',
//     456,
//     TransactionType.Incom
//   );
//   await transactonService.saveTransaction(saveTransactionCommand);
// };

// const saveToConsole = async () => {
//   const transactonService = new TransactionService(storage);
//   const saveTransactionCommand = new SaveTransactionCommand(
//     '1',
//     456,
//     TransactionType.Incom
//   );
//   await transactonService.saveTransaction(saveTransactionCommand);
// };

// Promise.allSettled([saveToFile(), saveToConsole()]);

// saveToConsole();
// setTimeout(() => {
//   storage = new FileStorageAdapter();
//   saveToConsole(); // -> file
// }, 3000);

// ..
