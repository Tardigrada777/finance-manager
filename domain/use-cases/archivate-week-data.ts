import { UseCase } from './use-case';

export class ArchivateWeekDataUseCase extends UseCase {
  use() {
    this._in.on('archivate-week-data', async () => {
      await this._out.makeArchive();
      await this._out.clearWalletsData();
    });
  }
}
