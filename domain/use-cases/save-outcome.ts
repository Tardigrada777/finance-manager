import { SaveOutcomePayload } from '../ports/in/events';
import { UseCase } from './use-case';

export class SaveOutcomeUseCase extends UseCase {
  use() {
    this._in.on('save-outcome', async (payload: SaveOutcomePayload) => {
      const currentDayOutcome = await this._out.getOutcomeOfDay(
        payload.wallet,
        new Date()
      );
      if (currentDayOutcome === null) {
        throw new Error(
          `Bad request. There is no wallet with name: ${payload.wallet}`
        );
      }
      this._out.saveOutcomeByWallet(payload.wallet, {
        amount: currentDayOutcome + payload.amount,
      });
    });
  }
}
