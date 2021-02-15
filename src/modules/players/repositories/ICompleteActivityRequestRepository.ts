import { ICompleteActivityRequest } from '@modules/players/entities';

export default interface ICompleteActivityRequestRepository<
  T extends ICompleteActivityRequest = ICompleteActivityRequest
> {
  findAllFromGame(gameId: string): Promise<T[]>;
  findOne(id: string): Promise<ICompleteActivityRequest | undefined>;
  create(player: Omit<ICompleteActivityRequest, 'id'>): Promise<T>;
  delete(id: string, gameId: string): Promise<void>;
}
